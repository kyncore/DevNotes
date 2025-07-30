# Module 3: Exam Questions & Answers

These questions focus on exposing applications and controlling traffic, key skills for the CKA exam.

---

### Question 1

**Task:**
A deployment named `api-server` is running in the `dev` namespace.
*   Create a `NodePort` service to expose this deployment.
*   The service should be named `api-service`.
*   The service should expose port `80` and route traffic to the pods' port `8080`.
*   The service should be assigned a static `nodePort` of `30080`.

**Answer:**

1.  **Use `kubectl expose` with the required flags.** You can't set the `nodePort` directly here, so we'll generate YAML and edit it.
    ```bash
    kubectl expose deployment api-server --name=api-service --port=80 --target-port=8080 --type=NodePort -n dev --dry-run=client -o yaml > service.yaml
    ```

2.  **Edit the YAML file:**
    *   Open `service.yaml` with an editor.
    *   Under `spec.ports`, add the `nodePort: 30080` field.
    ```yaml
    apiVersion: v1
    kind: Service
    metadata:
      name: api-service
      namespace: dev
    spec:
      ports:
      - port: 80
        protocol: TCP
        targetPort: 8080
        nodePort: 30080 # <-- Add this line
      selector:
        # This will be filled in by the deployment's labels
      type: NodePort
    ```

3.  **Apply the manifest:**
    ```bash
    kubectl apply -f service.yaml
    ```

4.  **Verification:**
    ```bash
    kubectl get service api-service -n dev
    # Check that the port mapping is 80:30080/TCP
    ```

---

### Question 2

**Task:**
Create an `Ingress` resource named `app-ingress`.
*   It should handle traffic for the host `webapp.example.com`.
*   Traffic to the path `/` should be routed to a service named `webapp-service` on port `80`.
*   Traffic to the path `/api` should be routed to a service named `api-service` on port `8080`.

**Answer:**

1.  **There is no `kubectl create ingress` command.** You must create a YAML file.

2.  **Create the Ingress YAML:**
    ```yaml
    apiVersion: networking.k8s.io/v1
    kind: Ingress
    metadata:
      name: app-ingress
    spec:
      rules:
      - host: webapp.example.com
        http:
          paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: webapp-service
                port:
                  number: 80
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: api-service
                port:
                  number: 8080
    ```

3.  **Apply the manifest:**
    ```bash
    kubectl apply -f ingress.yaml # (Assuming you saved the content to this file)
    ```

4.  **Verification:**
    ```bash
    kubectl get ingress app-ingress
    kubectl describe ingress app-ingress
    # This will show the rules you configured.
    ```
    *(Note: For the Ingress to work, an Ingress Controller must be running in the cluster.)*

---

### Question 3

**Task:**
There is a pod named `dns-test` in the `default` namespace. It is having trouble communicating with other services.
*   Identify the DNS server IP address that the pod is configured to use.
*   Write this IP address to the file `/tmp/dns-ip.txt`.

**Scenario Setup (for practice):**
```bash
kubectl run dns-test --image=busybox -- sleep 3600
```

**Answer:**

1.  **Exec into the pod and view its `resolv.conf` file.** This file contains the DNS configuration.
    ```bash
    kubectl exec -it dns-test -- cat /etc/resolv.conf
    ```

2.  **Extract the IP and save it:**
    *   The output will look something like this:
        ```
        nameserver 10.96.0.10
        search default.svc.cluster.local svc.cluster.local cluster.local
        options ndots:5
        ```
    *   The IP address is `10.96.0.10` (the IP of the `kube-dns` service).
    *   You can use shell commands to extract and save it.
    ```bash
    kubectl exec -it dns-test -- cat /etc/resolv.conf | grep 'nameserver' | awk '{print $2}' > /tmp/dns-ip.txt
    ```

3.  **Verification:**
    ```bash
    cat /tmp/dns-ip.txt
    # Should contain only the IP address.
    ```

---

### Question 4

**Task:**
Create a `NetworkPolicy` named `api-allow-policy` in the `production` namespace.
*   The policy should apply to all pods with the label `app=api`.
*   It should allow **ingress** traffic on TCP port `8080` only from pods that have the label `role=frontend`.
*   It should not restrict any egress traffic.

**Answer:**

1.  **You must create a YAML file for Network Policies.**

2.  **Create the NetworkPolicy YAML:**
    ```yaml
    apiVersion: networking.k8s.io/v1
    kind: NetworkPolicy
    metadata:
      name: api-allow-policy
      namespace: production
    spec:
      podSelector:
        matchLabels:
          app: api
      policyTypes:
      - Ingress # We only care about Ingress, so Egress is unaffected
      ingress:
      - from:
        - podSelector:
            matchLabels:
              role: frontend
        ports:
        - protocol: TCP
          port: 8080
    ```

3.  **Apply the manifest:**
    ```bash
    kubectl apply -f netpol.yaml # (Assuming you saved the content to this file)
    ```

4.  **Verification:**
    ```bash
    kubectl get networkpolicy -n production api-allow-policy
    kubectl describe networkpolicy -n production api-allow-policy
    # This will show the rules you have applied.
    ```
