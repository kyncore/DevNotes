# Module 5: Troubleshooting

Troubleshooting is the most heavily weighted domain in the CKA exam (30%). This section synthesizes knowledge from all previous modules and applies it to diagnosing and fixing real-world problems in a Kubernetes cluster. Speed and a systematic approach are key.

## The Troubleshooting Workflow

A systematic approach is crucial when faced with a problem. A good general workflow is:

1.  **Isolate the Problem:** Understand what is failing. Is it a single pod? A deployment? A whole node? Communication between services?
2.  **Gather Information (`kubectl` is your best friend):**
    *   `kubectl get <resource> -o wide`: Get a high-level overview. `-o wide` is critical for seeing which node a pod is on.
    *   `kubectl describe <resource> <name>`: This is your primary tool. It provides detailed information, and most importantly, the `Events` section at the bottom, which often tells you exactly what's wrong.
    *   `kubectl logs <pod-name>`: Check the application logs from within a pod. Use `-p` to view logs from a previous, crashed instance of a container.
    *   `kubectl exec -it <pod-name> -- /bin/sh`: Get a shell inside a running container to test connectivity or check the local environment.
3.  **Analyze the Control Plane:** If the issue seems to be cluster-wide, investigate the health of the control plane components.
4.  **Analyze the Worker Nodes:** If the issue is on a specific node, investigate the `kubelet`.
5.  **Form a Hypothesis and Test:** Based on the information gathered, form a theory about the cause and apply a fix.

## Common Problem Areas

### 1. Pod Failures

*   **`Pending` State:**
    *   **Cause:** The scheduler cannot place the pod on a node.
    *   **Debug:** `kubectl describe pod <pod-name>`. Look at the Events.
    *   **Common Reasons:** Insufficient resources (CPU/memory), no node matches affinity/selector rules, node is tainted and pod has no toleration.

*   **`CrashLoopBackOff` State:**
    *   **Cause:** The container starts, crashes, is restarted by the kubelet, and crashes again.
    *   **Debug:**
        1.  `kubectl logs <pod-name>`: Check the application logs. The error is almost always here.
        2.  `kubectl logs <pod-name> -p`: Check the logs of the *previous* crashed container.
        3.  `kubectl describe pod <pod-name>`: Check for misconfigured arguments, environment variables, or failing probes.

*   **`ImagePullBackOff` / `ErrImagePull` State:**
    *   **Cause:** The kubelet cannot pull the container image.
    *   **Debug:** `kubectl describe pod <pod-name>`.
    *   **Common Reasons:** Typo in the image name or tag, image does not exist, trying to pull a private image without an `imagePullSecret`.

*   **`CreateContainerConfigError` State:**
    *   **Cause:** A required resource, like a `ConfigMap` or `Secret` that is referenced in the pod spec, does not exist.
    *   **Debug:** `kubectl describe pod <pod-name>`. The Events section will name the missing resource.

### 2. Service and Networking Failures

*   **Pod cannot connect to another service:**
    *   **Debug Steps:**
        1.  **Check Service and Endpoints:** Does the Service exist? `kubectl get svc <service-name>`. Does it have endpoints? `kubectl get endpoints <service-name>`. If the endpoints are missing, the service's label selector is not matching any running, ready pods.
        2.  **Check Pod Labels:** Do the backend pods have the correct labels to match the service selector?
        3.  **Check `targetPort`:** Does the service's `targetPort` match the port the application is actually listening on inside the container?
        4.  **Check Network Policies:** Is there a NetworkPolicy blocking the traffic? `kubectl get netpol`.
        5.  **DNS Resolution:** Can the client pod resolve the service's DNS name? Use `nslookup` from within the client pod. `kubectl exec -it <client-pod> -- nslookup <service-name>`.

### 3. Control Plane Failures

*   **`kubectl` commands are slow or failing:**
    *   **Cause:** The `kube-apiserver` might be down or overloaded.
    *   **Debug:**
        1.  SSH into the control plane node.
        2.  Check the status of the control plane static pods: `sudo crictl ps` (or `docker ps`). Look for `kube-apiserver`, `kube-scheduler`, `kube-controller-manager`.
        3.  Check their logs: `sudo crictl logs <container-id>` (or `docker logs`).

### 4. Worker Node Failures

*   **Node is in `NotReady` state:**
    *   **Cause:** The `kubelet` on that node is not reporting a healthy status to the control plane.
    *   **Debug:**
        1.  SSH into the affected worker node.
        2.  Check the status of the `kubelet` service: `sudo systemctl status kubelet`.
        3.  Check the `kubelet` logs for errors: `sudo journalctl -u kubelet -f`.
    *   **Common Reasons:** The node is under resource pressure (memory/CPU), the container runtime is not working, or there is a networking issue preventing the kubelet from communicating with the API server.
