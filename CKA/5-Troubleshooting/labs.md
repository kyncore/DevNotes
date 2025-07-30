# Module 5: Labs

These labs simulate common failure scenarios. For each lab, a broken setup is described. Your task is to identify the root cause and fix it.

---

### Lab 1: Fixing a Pending Pod

**Scenario:** A developer has deployed a pod, but it remains in the `Pending` state.

**Setup:**
1.  Taint one of your worker nodes: `kubectl taint nodes <node-name> role=critical:NoSchedule`
2.  Create the broken pod manifest `pending-pod.yaml`:
    ```yaml
    apiVersion: v1
    kind: Pod
    metadata:
      name: critical-app
    spec:
      containers:
      - name: main
        image: nginx
    ```
3.  Apply it: `kubectl apply -f pending-pod.yaml`

**Your Task:**
1.  Identify why the `critical-app` pod is not being scheduled.
2.  Fix the issue by modifying the `pending-pod.yaml` manifest.
3.  Apply the fix and confirm the pod is running.

**Solution:**
1.  **Diagnose:** `kubectl describe pod critical-app`. The `Events` section will show a message like `0/2 nodes are available: 1 node(s) had taint {role: critical}, that the pod didn't tolerate`.
2.  **Fix:** Add the required toleration to `pending-pod.yaml`.
    ```yaml
    # ...
    spec:
      tolerations:
      - key: "role"
        operator: "Equal"
        value: "critical"
        effect: "NoSchedule"
      containers:
    # ...
    ```
3.  **Apply:** `kubectl apply -f pending-pod.yaml`. The pod should now be scheduled and run successfully.
4.  **Cleanup:** `kubectl delete pod critical-app` and `kubectl taint nodes <node-name> role:NoSchedule-`.

---

### Lab 2: Fixing a Crashing Application

**Scenario:** A deployment was created, but the pods are in a `CrashLoopBackOff` state.

**Setup:**
1.  Create the broken deployment manifest `crash-deploy.yaml`:
    ```yaml
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: mail-sender
    spec:
      replicas: 1
      selector:
        matchLabels:
          app: mailer
      template:
        metadata:
          labels:
            app: mailer
        spec:
          containers:
          - name: app
            image: busybox
            command: ["sh", "-c", "sleep 5; exit 1"] # This command exits with an error code
    ```
2.  Apply it: `kubectl apply -f crash-deploy.yaml`

**Your Task:**
1.  Identify the cause of the crash loop.
2.  Fix the deployment's pod template to run a command that doesn't exit.
3.  Confirm the pod becomes stable and `Running`.

**Solution:**
1.  **Diagnose:**
    *   `kubectl get pods`: Shows the pod is in `CrashLoopBackOff`.
    *   `kubectl logs <pod-name>`: The logs will be empty because the command is too simple.
    *   `kubectl describe deployment mail-sender`: Look at the `command` in the pod template. It's designed to exit with an error.
2.  **Fix:** Edit the deployment to use a long-running command.
    ```bash
    kubectl edit deployment mail-sender
    ```
    *   Change the command section to something like:
    ```yaml
    # ...
    command: ["sh", "-c", "sleep 3600"]
    # ...
    ```
3.  **Verify:** The deployment will create a new pod with the correct command, and it will stay in the `Running` state.
4.  **Cleanup:** `kubectl delete deployment mail-sender`.

---

### Lab 3: Fixing Broken Service Communication

**Scenario:** A frontend pod cannot communicate with a backend service.

**Setup:**
1.  Create the backend:
    ```bash
    kubectl create deployment backend --image=nginx --labels=app=backend-app # Correct label
    ```
2.  Create the broken service `backend-svc.yaml`:
    ```yaml
    apiVersion: v1
    kind: Service
    metadata:
      name: backend-service
    spec:
      selector:
        app: backend # <-- BUG: Mismatched selector
      ports:
        - protocol: TCP
          port: 80
          targetPort: 80
    ```
3.  Apply it: `kubectl apply -f backend-svc.yaml`.
4.  Create the frontend pod: `kubectl run -it --rm --image=busybox frontend -- sh`.

**Your Task:**
1.  From inside the `frontend` pod shell, you will try `wget -O- --timeout=2 backend-service` and see that it fails.
2.  Diagnose why the service is not routing traffic to the backend pods.
3.  Fix the issue.
4.  Confirm that the `wget` command from the frontend pod now succeeds.

**Solution:**
1.  **Diagnose:**
    *   `kubectl describe svc backend-service`: Look at the `Selector` field. It is `app=backend`.
    *   `kubectl get pods --show-labels`: Look at the labels on the backend pods. They are `app=backend-app`. The labels don't match.
    *   `kubectl get endpoints backend-service`: You will see that the service has no endpoints, confirming the selector mismatch.
2.  **Fix:** Edit the service to use the correct label selector.
    ```bash
    kubectl edit service backend-service
    ```
    *   Change `selector.app` from `backend` to `backend-app`.
3.  **Verify:**
    *   Check the endpoints again: `kubectl get endpoints backend-service`. It should now be populated with the IPs of the backend pods.
    *   Run the `wget` command from the frontend pod again. It should now succeed.
4.  **Cleanup:** `kubectl delete deployment backend` and `kubectl delete service backend-service`.

---

### Lab 4: Fixing a Node in `NotReady` State

**Scenario:** A worker node has gone into the `NotReady` state. Pods are no longer being scheduled on it.

**Setup (Conceptual):**
This is hard to script. To simulate, you can SSH into a worker node and stop the kubelet.
```bash
# On a worker node
sudo systemctl stop kubelet
```

**Your Task:**
1.  Identify which node is `NotReady`.
2.  SSH into the affected node.
3.  Diagnose the root cause of the failure.
4.  Fix the issue and ensure the node returns to the `Ready` state.

**Solution:**
1.  **Diagnose:** `kubectl get nodes`. You will see one node with the status `NotReady`.
2.  **SSH into the node:** `ssh user@<not-ready-node-ip>`.
3.  **Check the kubelet:**
    ```bash
    sudo systemctl status kubelet
    ```
    *   This will show that the service is `inactive (dead)`.
4.  **Fix:** Restart the kubelet.
    ```bash
    sudo systemctl start kubelet
    ```
5.  **Verify:**
    *   Check the status again: `sudo systemctl status kubelet`. It should be `active (running)`.
    *   Go back to your control plane node and run `kubectl get nodes`. After a minute, the node should return to the `Ready` state.
    *   **Further investigation:** If restarting doesn't work, use `sudo journalctl -u kubelet -f` to view the live logs of the kubelet to find the underlying error (e.g., misconfiguration, networking issue, etc.).
