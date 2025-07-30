# Module 3: Services & Networking

This domain covers how services in a Kubernetes cluster communicate with each other and how external traffic is routed to them. Networking is a complex but essential part of Kubernetes.

## Service

A Kubernetes **Service** is an abstract way to expose an application running on a set of Pods as a network service. Because Pods are ephemeral, a Service provides a stable endpoint (IP address and DNS name) that other services can use to communicate with the Pods in the application.

*   **Selectors:** Services use **labels** and **selectors** to match a set of backend Pods. If a Pod has the correct labels, it will automatically be picked up by the Service.

### Service Types

*   **`ClusterIP`**: (Default type) Exposes the Service on a cluster-internal IP. This makes the Service only reachable from within the cluster. This is the most common type for internal microservice communication.

*   **`NodePort`**: Exposes the Service on each Node's IP at a static port (the `NodePort`). A `ClusterIP` Service, to which the `NodePort` Service routes, is automatically created. You can contact the `NodePort` Service, from outside the cluster, by requesting `<NodeIP>:<NodePort>`.

*   **`LoadBalancer`**: Exposes the Service externally using a cloud provider's load balancer. `NodePort` and `ClusterIP` Services, to which the external load balancer routes, are automatically created. This is the standard way to expose a service to the internet on a cloud platform like AWS, GCP, or Azure.

*   **`ExternalName`**: Maps the Service to the contents of a CNAME record (e.g., `foo.bar.example.com`). No proxying of any kind is set up. This is often used to provide a Kubernetes-native name for an external service.

## Ingress

An **Ingress** is an API object that manages external access to the services in a cluster, typically HTTP. Ingress can provide load balancing, SSL termination, and name-based virtual hosting.

*   **How it Works:** An Ingress itself does nothing. It's a set of rules. You must have an **Ingress Controller** running in your cluster to fulfill the Ingress. The Ingress Controller is a pod that acts as a reverse proxy and load balancer (e.g., Nginx, Traefik, HAProxy).
*   **Use Case:** You have multiple services in your cluster (`/api`, `/ui`, `/blog`). Instead of creating multiple `LoadBalancer` services (which can be expensive), you can create one Ingress. The Ingress Controller reads the Ingress rules and routes traffic accordingly:
    *   `http://example.com/api` -> `api-service`
    *   `http://example.com/ui` -> `ui-service`

## Network Policies

A **NetworkPolicy** is a specification of how groups of pods are allowed to communicate with each other and other network endpoints. `NetworkPolicy` resources use labels to select pods and define rules which specify what traffic is allowed to the selected pods.

*   **How it Works:** Like Ingress, a NetworkPolicy resource does nothing on its own. You must have a CNI (Container Network Interface) plugin that supports Network Policies (e.g., Calico, Cilium, Weave Net) running in your cluster.
*   **Default Behavior:** By default, all pods in a cluster can communicate with all other pods. There are no network restrictions.
*   **Isolation:** Once a NetworkPolicy selects a pod, that pod becomes **isolated**. This means it will reject any connections that are not explicitly allowed by a policy.
*   **Rule Types:**
    *   **`Ingress`**: Whitelist rules for incoming traffic.
    *   **`Egress`**: Whitelist rules for outgoing traffic.

## DNS in Kubernetes

Kubernetes provides a DNS service to provide service discovery for pods and services.

*   **CoreDNS:** The default DNS server for Kubernetes clusters. It's deployed as a set of pods and has its own Service.
*   **Service DNS Records:** For a Service named `my-svc` in a namespace `my-ns`, a DNS A/AAAA record is created for `my-svc.my-ns`. Pods in the same namespace can simply look up `my-svc`. Pods in other namespaces must use the fully qualified domain name (FQDN) `my-svc.my-ns`.
*   **Pod DNS Records:** Pods can also have DNS records, but this is less common.
*   **`resolv.conf`:** The `kubelet` configures the `resolv.conf` file inside each container to point to the CoreDNS service's IP address, enabling DNS lookups from within the pod. Debugging this file is a common troubleshooting step.
