# Module 2: Exam Questions & Answers

Practice these questions to improve your speed with `kubectl` for managing workloads.

---

### Question 1

**Task:**
Create a new Deployment named `web-frontend`.
*   It should have **3** replicas.
*   The container image should be `httpd:2.4-alpine`.
*   The pods should have the label `app=webserver`.

**Answer:**

1.  **Use `kubectl create deployment` with the required flags:**
    ```bash
    kubectl create deployment web-frontend --image=httpd:2.4-alpine --replicas=3
    ```

2.  **Add the label to the pods managed by the deployment:**
    *   You can't add the label directly with the `create` command. You need to use `kubectl label`. The deployment will ensure the pods it creates have this label.
    ```bash
    kubectl label deployment web-frontend app=webserver
    ```
    *   Alternatively, and often better, is to edit the deployment manifest directly.
    ```bash
    kubectl edit deployment web-frontend
    # Now, add the 'app: webserver' label under spec.template.metadata.labels
    ```

3.  **Verification:**
    ```bash
    kubectl get pods --selector=app=webserver
    # This should show 3 pods running.
    ```

---

### Question 2

**Task:**
Create a `DaemonSet` named `log-collector`.
*   The container image should be `fluentd:v1.14-debian`.
*   The DaemonSet should run in the `kube-system` namespace.

**Answer:**

1.  **There is no `kubectl create daemonset` command.** You must create a YAML file. The fastest way is to generate a template from a deployment or pod and modify it.

2.  **Generate a base YAML:**
    ```bash
    # Use --dry-run=client -o yaml to print the YAML without creating the object
    kubectl create deployment log-collector --image=fluentd:v1.14-debian --dry-run=client -o yaml > daemonset.yaml
    ```

3.  **Modify the YAML file:**
    *   Open `daemonset.yaml` in an editor (`vi`, `nano`).
    *   Change `kind: Deployment` to `kind: DaemonSet`.
    *   Change `metadata.namespace` to `kube-system`.
    *   Remove the entire `spec.replicas` field.
    *   Remove the `spec.strategy` field.
    *   Remove the `status` section at the bottom.

    The final `daemonset.yaml` should look like this:
    ```yaml
    apiVersion: apps/v1
    kind: DaemonSet
    metadata:
      name: log-collector
      namespace: kube-system
      labels:
        app: log-collector
    spec:
      selector:
        matchLabels:
          app: log-collector
      template:
        metadata:
          labels:
            app: log-collector
        spec:
          containers:
          - name: fluentd
            image: fluentd:v1.14-debian
    ```

4.  **Apply the manifest:**
    ```bash
    kubectl apply -f daemonset.yaml
    ```

5.  **Verification:**
    ```bash
    kubectl get daemonset -n kube-system log-collector
    ```

---

### Question 3

**Task:**
A pod named `app-pod` is running. It was created from the manifest `/tmp/pod.yaml`. The pod is failing its liveness probe and is being restarted constantly.
*   Identify the cause of the failure.
*   Fix the issue by editing the manifest `/tmp/pod.yaml` and re-applying it. Do not delete the pod.

**Scenario Setup (for practice):**
First, create the broken pod manifest:
```bash
cat <<EOF > /tmp/pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: app-pod
spec:
  containers:
  - name: main-app
    image: busybox
    command: ['sh', '-c', 'sleep 10; touch /tmp/ready; sleep 300']
    livenessProbe:
      exec:
        command:
        - cat
        - /tmp/im-healthy  # <-- This is the bug
      initialDelaySeconds: 5
EOF
kubectl apply -f /tmp/pod.yaml
```

**Answer:**

1.  **Identify the cause:**
    *   Use `kubectl describe pod app-pod`.
    *   Look at the `Events` section. You will see messages like `Liveness probe failed: cat /tmp/im-healthy: No such file or directory`.
    *   Look at the container's command. It creates a file at `/tmp/ready`, but the probe is checking for `/tmp/im-healthy`. This is the mismatch.

2.  **Fix the manifest:**
    *   Edit the YAML file: `vi /tmp/pod.yaml`.
    *   Change the `livenessProbe` command to check for the correct file path.
    ```yaml
    # ...
    livenessProbe:
      exec:
        command:
        - cat
        - /tmp/ready # <-- Correct path
      initialDelaySeconds: 5
    # ...
    ```

3.  **Re-apply the manifest:**
    *   Use `kubectl apply` to update the running pod's definition.
    ```bash
    kubectl apply -f /tmp/pod.yaml
    ```

4.  **Verification:**
    *   Run `kubectl get pod app-pod`. The `RESTARTS` count should stop increasing, and the pod should become `Running` and stable.

---

### Question 4

**Task:**
Create a `Job` named `pi-calculator` that calculates PI to 2000 decimal places.
*   The container image should be `perl:5.34`.
*   The job should run the command `perl -Mbignum=bpi -wle 'print bpi(2000)'`.
*   Ensure the job is cleaned up automatically after it finishes.

**Answer:**

1.  **Create the Job YAML:**
    *   The easiest way is to use `kubectl create job` with `--dry-run`.
    ```bash
    kubectl create job pi-calculator --image=perl:5.34 --dry-run=client -o yaml -- perl -Mbignum=bpi -wle 'print bpi(2000)' > job.yaml
    ```

2.  **Edit the YAML to add cleanup behavior:**
    *   The command generation is tricky, so we'll fix it and add the `ttlSecondsAfterFinished`.
    *   Open `job.yaml` and edit it to look like this:
    ```yaml
    apiVersion: batch/v1
    kind: Job
    metadata:
      name: pi-calculator
    spec:
      ttlSecondsAfterFinished: 100 # Cleanup after 100 seconds
      template:
        spec:
          containers:
          - name: pi-calculator
            image: perl:5.34
            command: ["perl",  "-Mbignum=bpi", "-wle", "print bpi(2000)"]
          restartPolicy: Never
    ```

3.  **Apply the manifest:**
    ```bash
    kubectl apply -f job.yaml
    ```

4.  **Verification:**
    *   Check the job's status: `kubectl get job pi-calculator`.
    *   Check the logs of the pod created by the job to see the result:
        ```bash
        # First, find the pod name
        POD_NAME=$(kubectl get pods --selector=job-name=pi-calculator -o jsonpath="{.items[0].metadata.name}")
        # Then, get the logs
        kubectl logs $POD_NAME
        ```
    *   After 100 seconds, the job and its pod will be automatically deleted.
