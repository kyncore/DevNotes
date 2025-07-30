# Module 3: Labs

These labs focus on exposing applications and controlling network traffic flow.

---

### Lab 1: Exposing an Application with a Service

**Objective:** Create a Deployment and expose it within the cluster using a `ClusterIP` Service, then expose it outside the cluster using a `NodePort` Service.

**Instructions:**

1.  **Create a Deployment:**
    *   Create a deployment named `webapp` with 3 replicas, using the `kodekloud/simple-webapp` image. This image runs a simple web server on port 8080.
    *   Ensure the pods have the label `app=webapp`.
        ```bash
        kubectl create deployment webapp --image=kodekloud/simple-webapp --replicas=3
        kubectl label deployment webapp app=webapp
        ```

2.  **Expose with `ClusterIP`:**
    *   Create a `ClusterIP` Service named `webapp-clusterip` that exposes the deployment on port 80, targeting the container's port 8080.
        ```bash
        kubectl expose deployment webapp --name=webapp-clusterip --port=80 --target-port=8080 --type=ClusterIP
        ```

3.  **Verify `ClusterIP` Access:**
    *   Get the IP address of the service: `kubectl get svc webapp-clusterip`.
    *   Launch a temporary pod and try to access the service from within the cluster.
        ```bash
        # Run a temporary pod with curl
        kubectl run --rm -it --image=busybox test-pod -- sh

        # Inside the test-pod shell, access the service by its name (DNS)
        wget -O- webapp-clusterip:80

        # You should see the HTML from the webapp.
        # Exit the pod
        exit
        ```

4.  **Expose with `NodePort`:**
    *   Now, create a `NodePort` service to expose the same deployment externally.
        ```bash
        kubectl expose deployment webapp --name=webapp-nodeport --port=80 --target-port=8080 --type=NodePort
        ```

5.  **Verify `NodePort` Access:**
    *   Get the port assigned by the `NodePort` service.
        ```bash
        kubectl get svc webapp-nodeport
        # The port will be listed, e.g., 80:3xxxx/TCP
        ```
    *   Find the IP address of one of your worker nodes: `kubectl get nodes -o wide`.
    *   From your local machine (if it has network access to the nodes) or from the control plane node, use `curl` to access the service.
        ```bash
        # Replace <NodeIP> and <NodePort> with your values
        curl http://<NodeIP>:<NodePort>
        ```
    *   You should see the HTML from the webapp.

6.  **Clean Up:**
    ```bash
    kubectl delete deployment webapp
    kubectl delete service webapp-clusterip webapp-nodeport
    ```

---

### Lab 2: Implementing a Network Policy

**Objective:** Restrict traffic between two applications using a Network Policy.

**Instructions:**

1.  **Create two applications:**
    *   Create a "backend" deployment with the label `app=backend`.
    *   Create a "frontend" deployment with the label `app=frontend`.
    *   Expose the backend deployment with a ClusterIP service named `backend-service`.
        ```bash
        kubectl create deployment backend --image=nginx --labels=app=backend
        kubectl expose deployment backend --name=backend-service --port=80

        kubectl create deployment frontend --image=busybox --labels=app=frontend -- sleep 3600
        ```

2.  **Verify Open Communication:**
    *   Get the pod name for the frontend: `kubectl get pods -l app=frontend`.
    *   Exec into the frontend pod and try to access the backend service. It should succeed.
        ```bash
        # Replace <frontend-pod-name> with your pod's name
        kubectl exec -it <frontend-pod-name> -- wget -O- backend-service
        # This should return the Nginx welcome page.
        ```

3.  **Isolate the Backend:**
    *   Create a `NetworkPolicy` that selects the backend pods but has no rules. This will deny all ingress traffic.
    *   Create a file `deny-all.yaml`:
    ```yaml
    apiVersion: networking.k8s.io/v1
    kind: NetworkPolicy
    metadata:
      name: backend-deny-all
    spec:
      podSelector:
        matchLabels:
          app: backend
      policyTypes:
      - Ingress
    ```
    *   Apply it: `kubectl apply -f deny-all.yaml`.

4.  **Verify Blocked Communication:**
    *   Exec into the frontend pod again and try to access the backend. The command should now time out.
        ```bash
        kubectl exec -it <frontend-pod-name> -- wget -O- --timeout=5 backend-service
        # This should fail.
        ```

5.  **Allow Traffic from Frontend:**
    *   Modify the policy to allow ingress traffic specifically from pods with the `app=frontend` label.
    *   Create a file `allow-frontend.yaml`:
    ```yaml
    apiVersion: networking.k8s.io/v1
    kind: NetworkPolicy
    metadata:
      name: backend-deny-all # We can keep the same name to update it
    spec:
      podSelector:
        matchLabels:
          app: backend
      policyTypes:
      - Ingress
      ingress:
      - from:
        - podSelector:
            matchLabels:
              app: frontend
    ```
    *   Apply it: `kubectl apply -f allow-frontend.yaml`.

6.  **Verify Allowed Communication:**
    *   Exec into the frontend pod one last time. The connection to the backend should now succeed again.

7.  **Clean Up:**
    ```bash
    kubectl delete deployment backend frontend
    kubectl delete service backend-service
    kubectl delete networkpolicy backend-deny-all
    ```
