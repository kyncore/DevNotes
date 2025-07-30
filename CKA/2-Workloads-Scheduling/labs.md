# Module 2: Labs

These labs will help you get comfortable with creating and managing various Kubernetes workload objects.

---

### Lab 1: Creating and Managing a Deployment

**Objective:** Deploy a simple Nginx web server using a Deployment, scale it, and perform a rolling update.

**Instructions:**

1.  **Create a Deployment:**
    *   Create a Deployment named `nginx-deployment` with 2 replicas, using the `nginx:1.21.6` image.
    *   The fastest way is imperatively:
        ```bash
        kubectl create deployment nginx-deployment --image=nginx:1.21.6 --replicas=2
        ```

2.  **Verify the Deployment:**
    *   Check the status of the Deployment, the ReplicaSet, and the Pods.
        ```bash
        kubectl get deployment nginx-deployment
        kubectl get replicaset
        kubectl get pods
        ```
    *   You should see one Deployment, one ReplicaSet, and two Pods running.

3.  **Scale the Deployment:**
    *   Scale the number of replicas up to 4.
        ```bash
        kubectl scale deployment nginx-deployment --replicas=4
        ```
    *   Verify that there are now 4 pods running.

4.  **Perform a Rolling Update:**
    *   Update the Nginx image to version `1.22.0`.
        ```bash
        kubectl set image deployment/nginx-deployment nginx=nginx:1.22.0
        ```
    *   Watch the update happen in real-time. Kubernetes will terminate old pods and create new ones gracefully.
        ```bash
        kubectl rollout status deployment/nginx-deployment
        # You can also run 'kubectl get pods -w' in another terminal
        ```

5.  **Check Update History and Roll Back:**
    *   Check the history of the rollout.
        ```bash
        kubectl rollout history deployment/nginx-deployment
        ```
    *   Imagine the new version has a bug. Roll back to the previous version.
        ```bash
        kubectl rollout undo deployment/nginx-deployment
        ```
    *   Verify that the pods are now running the old image version (`1.21.6`). You can use `kubectl describe pod <pod-name>` to check the image tag.

6.  **Clean Up:**
    ```bash
    kubectl delete deployment nginx-deployment
    ```

---

### Lab 2: Using Taints and Tolerations

**Objective:** Control pod scheduling using taints and tolerations.

**Instructions:**

1.  **Taint a Node:**
    *   Pick one of your worker nodes.
    *   Apply a taint to it with the key `app`, value `backend`, and effect `NoSchedule`. This means no pod will be scheduled on this node unless it has a matching toleration.
        ```bash
        # Replace <node-name> with your worker node's name
        kubectl taint nodes <node-name> app=backend:NoSchedule
        ```

2.  **Attempt to Schedule a Pod:**
    *   Create a simple Nginx pod.
        ```bash
        kubectl run untolerated-pod --image=nginx
        ```
    *   Check the status of the pod: `kubectl get pod untolerated-pod -o wide`. You will see it is `Pending` because it cannot be scheduled on the tainted node (assuming you only have one worker).

3.  **Create a Pod with a Toleration:**
    *   Create a YAML file named `toleration-pod.yaml`.
    ```yaml
    apiVersion: v1
    kind: Pod
    metadata:
      name: tolerated-pod
    spec:
      containers:
      - name: nginx
        image: nginx
      tolerations:
      - key: "app"
        operator: "Equal"
        value: "backend"
        effect: "NoSchedule"
    ```
    *   Apply the manifest: `kubectl apply -f toleration-pod.yaml`.
    *   Check the status of this new pod: `kubectl get pod tolerated-pod -o wide`. You will see it is now `Running` on the tainted node.

4.  **Clean Up:**
    *   Remove the taint from the node:
        ```bash
        # The '-' at the end removes the taint
        kubectl taint nodes <node-name> app=backend:NoSchedule-
        ```
    *   Delete the pods:
        ```bash
        kubectl delete pod untolerated-pod tolerated-pod
        ```

---

### Lab 3: Configuring Liveness and Readiness Probes

**Objective:** Add health checks to a pod to improve its reliability.

**Instructions:**

1.  **Create a Pod with Probes:**
    *   Create a YAML file named `probe-pod.yaml`. This pod has a web server that will start responding successfully after 15 seconds.
    ```yaml
    apiVersion: v1
    kind: Pod
    metadata:
      name: probe-demo
    spec:
      containers:
      - name: web-server
        image: busybox
        args:
        - /bin/sh
        - -c
        - 'sleep 10; touch /tmp/healthy; sleep 600'
        livenessProbe:
          exec:
            command:
            - cat
            - /tmp/healthy
          initialDelaySeconds: 5
          periodSeconds: 5
        readinessProbe:
          exec:
            command:
            - cat
            - /tmp/healthy
          initialDelaySeconds: 15
          periodSeconds: 5
    ```

2.  **Deploy and Observe:**
    *   Apply the manifest: `kubectl apply -f probe-pod.yaml`.
    *   Watch the pod's status closely: `kubectl describe pod probe-demo`.
    *   **Observe the Readiness Probe:** Notice the `Ready` condition in the `Conditions` section. It will be `false` for the first ~15 seconds because the readiness probe is failing (the file `/tmp/healthy` doesn't exist yet). After 15 seconds, it will become `true`. During the time it is `false`, the pod would not receive traffic from a Service.
    *   **Observe the Liveness Probe:** The liveness probe starts after 5 seconds. It succeeds as soon as the file is created. To see it fail, you can `exec` into the pod and delete the file:
        ```bash
        kubectl exec -it probe-demo -- rm /tmp/healthy
        ```
    *   After you delete the file, the liveness probe will fail. After a few failures, the `kubelet` will kill the container, and you will see the `RESTARTS` count for the pod increase when you run `kubectl get pods`.

3.  **Clean Up:**
    ```bash
    kubectl delete pod probe-demo
    ```
