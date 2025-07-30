# Module 1: Cluster Architecture, Installation & Configuration

This domain covers the fundamental components of a Kubernetes cluster, how they interact, and how to install and manage a cluster from the ground up. A deep understanding of this section is critical as it forms the foundation for everything else.

## Core Components of Kubernetes

A Kubernetes cluster consists of a set of worker machines, called **nodes**, that run containerized applications. Every cluster has at least one worker node. The worker node(s) host the **Pods** which are the components of the application workload. The **control plane** manages the worker nodes and the Pods in the cluster.

### Control Plane Components

The control plane's components make global decisions about the cluster (for example, scheduling), as well as detecting and responding to cluster events.

*   **`kube-apiserver`**: The API server is the front end for the Kubernetes control plane. It exposes the Kubernetes API, which is the primary way users, management devices, and CLI tools interact with the cluster. It is responsible for processing and validating REST requests and updating the state in `etcd`.

*   **`etcd`**: A consistent and highly-available key-value store used as Kubernetes' backing store for all cluster data. This is the single source of truth for your cluster's state. If you lose `etcd`, you lose your cluster's state.

*   **`kube-scheduler`**: The scheduler watches for newly created Pods that have no assigned node, and selects a node for them to run on. Scheduling decisions are based on resource requirements, hardware constraints, policy constraints, and more.

*   **`kube-controller-manager`**: This component runs controller processes. Logically, each controller is a separate process, but to reduce complexity, they are all compiled into a single binary and run in a single process. These controllers include:
    *   **Node Controller:** Responsible for noticing and responding when nodes go down.
    *   **Replication Controller:** Responsible for maintaining the correct number of pods for every replication controller object in the system.
    *   **Endpoints Controller:** Populates the Endpoints object (that is, joins Services & Pods).
    *   **Service Account & Token Controllers:** Create default accounts and API access tokens for new namespaces.

### Node Components

Node components run on every node, maintaining running pods and providing the Kubernetes runtime environment.

*   **`kubelet`**: An agent that runs on each node in the cluster. It makes sure that containers are running in a Pod. The kubelet takes a set of PodSpecs that are provided through various mechanisms and ensures that the containers described in those PodSpecs are running and healthy.

*   **`kube-proxy`**: A network proxy that runs on each node in your cluster, implementing part of the Kubernetes Service concept. It maintains network rules on nodes. These network rules allow network communication to your Pods from network sessions inside or outside of your cluster.

*   **Container Runtime**: The software that is responsible for running containers. Kubernetes supports several container runtimes: **Docker**, **containerd**, **CRI-O**, and any other that implements the Kubernetes CRI (Container Runtime Interface).

## Cluster Installation with `kubeadm`

`kubeadm` is a tool built to provide `kubeadm init` and `kubeadm join` as best-practice "fast paths" for creating Kubernetes clusters. It is the standard way to install a cluster for the CKA exam.

**The installation flow is:**
1.  **`kubeadm init`** on the control plane node to bootstrap the cluster. This command performs a series of pre-flight checks, generates certificates, sets up the control plane components as static pods, taints the control plane node, and generates a join token.
2.  **Install a CNI (Container Network Interface) plugin** like Calico, Flannel, or Weave Net. A CNI is required for pods to communicate with each other across nodes. The cluster will not be in a `Ready` state until a CNI is installed.
3.  **`kubeadm join`** on worker nodes, using the token from the `init` command, to securely add them to the cluster.

## Role-Based Access Control (RBAC)

RBAC is a method of regulating access to computer or network resources based on the roles of individual users within an enterprise.
*   **Role / ClusterRole**: A Role grants permissions to resources within a single namespace. A ClusterRole grants permissions cluster-wide.
*   **RoleBinding / ClusterRoleBinding**: A RoleBinding grants the permissions defined in a Role to a user or set of users. A ClusterRoleBinding grants the permissions in a ClusterRole cluster-wide.

## Certificates

Kubernetes requires PKI (Public Key Infrastructure) certificates for authentication over TLS. `kubeadm` automatically generates the required certificates for a cluster. Key certificates are:
*   **CA (Certificate Authority):** The root certificate used to sign all other certificates.
*   **API Server Certificate:** Used by the API server to prove its identity to clients.
*   **Kubelet Client Certificates:** Used by kubelets to authenticate with the API server.

You can manage these certificates using `kubeadm certs`.
