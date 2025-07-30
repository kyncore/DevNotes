# Module 5: Exam Questions & Answers

Troubleshooting questions require you to be fast and systematic. Use `kubectl describe` and `kubectl logs` as your primary tools.

---

### Question 1

**Task:**
The pods for the deployment `web-ui` are not running.
*   Diagnose the issue.
*   Fix the issue without modifying the deployment manifest.
*   Confirm the pods are running successfully.

**Scenario Setup (for practice):**
```bash
# Create the broken deployment
cat <<EOF > deploy.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-ui
spec:
  replicas: 2
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
      - name: nginx
        image: nginx:1.25.0
        ports:
        - containerPort: 80
        volumeMounts:
        - name: config-vol
          mountPath: /etc/config
      volumes:
      - name: config-vol
        configMap:
          name: ui-config # This ConfigMap does not exist
EOF
kubectl apply -f deploy.yaml
```

**Answer:**

1.  **Diagnose:**
    *   `kubectl get pods`: You will see the pods are stuck in `CreateContainerConfigError` or `Pending`.
    *   `kubectl describe pod <pod-name>`: In the `Events` section, you will see a clear error message: `ConfigMap "ui-config" not found`.

2.  **Fix the issue:**
    *   The problem is a missing `ConfigMap`. The task says not to modify the deployment, so we must create the missing `ConfigMap`.
    ```bash
    # Create a simple ConfigMap with any data.
    kubectl create configmap ui-config --from-literal=key1=value1
    ```

3.  **Verification:**
    *   Once the `ConfigMap` is created, the `kubelet` will be able to create the pods successfully.
    *   `kubectl get pods`: The pods for the `web-ui` deployment should now be in the `Running` state.

---

### Question 2

**Task:**
A new node, `ek8s-worker-3`, has been added to the cluster, but it is in the `NotReady` state.
*   Diagnose why the node is not ready.
*   Fix the issue on the node.
*   Ensure the node becomes `Ready`.

**Scenario Setup (for practice):**
This is conceptual. The problem will be that a critical component, like the CNI plugin's pod, is not running on that node, or the `kubelet` is misconfigured/stopped. A common CKA scenario is a missing CNI pod.

**Answer:**

1.  **Diagnose:**
    *   `kubectl get nodes`: Confirms `ek8s-worker-3` is `NotReady`.
    *   `kubectl describe node ek8s-worker-3`: Look at the `Conditions` section. You might see a message like `KubeletNotReady: container runtime network not ready: NetworkReady=false reason:NetworkPluginNotReady message:Network plugin returns error: cni plugin not initialized`. This points to the CNI.
    *   `kubectl get pods -A -o wide | grep ek8s-worker-3`: Check which system pods are running on the affected node. You would notice that the CNI daemonset pod (e.g., `calico-node-xxxxx`, `kube-flannel-ds-xxxxx`) is missing or failing on this node.

2.  **Identify the Cause:**
    *   Why is the CNI pod not running there? A common reason is that the node was added with a taint that the CNI daemonset does not tolerate.
    *   `kubectl describe node ek8s-worker-3 | grep Taints`: Check for any taints on the node.

3.  **Fix the issue:**
    *   If there is an unexpected taint, remove it. For example, if the node was accidentally tainted with `node-role.kubernetes.io/master=effect:NoSchedule`, the CNI pod wouldn't run there.
    ```bash
    # Example fix
    kubectl taint node ek8s-worker-3 node-role.kubernetes.io/master-
    ```

4.  **Verification:**
    *   Once the taint is removed, the CNI daemonset will schedule a pod on `ek8s-worker-3`.
    *   `kubectl get pods -A -o wide | grep ek8s-worker-3`: Confirm the CNI pod is now running on the node.
    *   `kubectl get nodes`: The node should transition to the `Ready` state.

---

### Question 3

**Task:**
The `kube-scheduler` on the control plane node is unhealthy.
*   Find the logs for the `kube-scheduler`.
*   Identify the error in the logs.
*   Write the error message to `/tmp/scheduler-error.txt`.

**Scenario Setup (for practice):**
This requires SSH access to the control plane. You would edit `/etc/kubernetes/manifests/kube-scheduler.yaml` and add a bad argument, like `--bad-flag=true`, to make it fail.

**Answer:**

1.  **SSH into the control plane node.**

2.  **Find the scheduler container:**
    *   The `kube-scheduler` runs as a static pod managed by the `kubelet`.
    *   Use `crictl` (or `docker`) to find the container.
    ```bash
    sudo crictl ps | grep scheduler
    ```
    *   This will give you the container ID.

3.  **Get the logs:**
    ```bash
    # Replace <container-id> with the ID from the previous step
    sudo crictl logs <container-id>
    ```

4.  **Identify and save the error:**
    *   Look through the logs for a line with `E` (Error) or `F` (Fatal). You would see a message like `F0730 12:00:00.000000 1 server.go:64] flag provided but not defined: -bad-flag`.
    *   Copy this error message.
    ```bash
    # You can use grep and redirect to save the line
    sudo crictl logs <container-id> 2>&1 | grep "flag provided but not defined" > /tmp/scheduler-error.txt
    ```
    *(Note: `2>&1` is important because `crictl logs` can write to both stdout and stderr).*

5.  **Verification:**
    ```bash
    cat /tmp/scheduler-error.txt
    ```
