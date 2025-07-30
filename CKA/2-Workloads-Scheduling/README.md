# Module 2: Workloads & Scheduling

This domain focuses on how to run and manage applications on Kubernetes. It covers the different types of workload resources, how to deploy them, and how the scheduler places them onto nodes.

## Pods

A **Pod** is the smallest and simplest unit in the Kubernetes object model that you create or deploy. A Pod represents a running process on your cluster and encapsulates one or more containers, storage resources, a unique network IP, and options that govern how the container(s) should run.

*   **Key Concept:** While Pods can contain multiple containers (the "sidecar" pattern), the most common use case is a single container per Pod. The containers within a Pod share the same network namespace and can communicate via `localhost`.
*   **Lifecycle:** Pods are considered ephemeral, disposable resources. If a Pod is terminated or fails, it is not automatically restarted. Instead, higher-level controllers are used to manage Pod replicas.

## Controllers for Stateless Applications

These controllers manage Pods and are designed for applications that do not need to maintain a persistent state.

*   **ReplicaSet:** Its primary purpose is to ensure that a specified number of Pod replicas are running at any given time. It's considered a lower-level controller.
*   **Deployment:** This is the most common way to manage stateless applications. A Deployment provides declarative updates for Pods and ReplicaSets. You describe a desired state in a Deployment, and the Deployment Controller changes the actual state to the desired state at a controlled rate.
    *   **Use Cases:** Rolling updates, rollbacks, scaling applications.

*   **DaemonSet:** Ensures that all (or some) Nodes run a copy of a Pod. As nodes are added to the cluster, Pods are added to them. As nodes are removed from the cluster, those Pods are garbage collected.
    *   **Use Cases:** Running a cluster storage daemon, a logs collection daemon, or a node monitoring daemon on every node.

## Controllers for Stateful Applications

*   **StatefulSet:** Used to manage stateful applications. It manages the deployment and scaling of a set of Pods, and provides guarantees about the ordering and uniqueness of these Pods.
    *   **Key Features:**
        *   **Stable, unique network identifiers:** Pods have a persistent name (e.g., `web-0`, `web-1`).
        *   **Stable, persistent storage:** Each Pod gets its own PersistentVolumeClaim, ensuring its data persists across restarts.
        *   **Ordered, graceful deployment and scaling:** Pods are created and terminated in a strict, ordered fashion.
    *   **Use Cases:** Databases like MySQL, Kafka, etcd.

## Jobs and CronJobs

*   **Job:** Creates one or more Pods and ensures that a specified number of them successfully terminate. A Job tracks the successful completions. When a specified number of successful completions is reached, the task (ie, Job) is complete.
    *   **Use Cases:** Running a one-off batch process, a data migration script.

*   **CronJob:** Manages time-based Jobs. It runs a Job periodically on a given schedule, written in Cron format.
    *   **Use Cases:** Performing regular backups, sending nightly reports.

## Scheduling

The Kubernetes **scheduler** is responsible for assigning Pods to Nodes. It makes its decisions based on several factors:

*   **Resource Requests and Limits:** A Pod can specify how much CPU and memory it needs (`requests`) and the maximum it can consume (`limits`). The scheduler will only place a Pod on a node that has enough available resources to meet its requests.
*   **Taints and Tolerations:**
    *   **Taints** are applied to Nodes. A taint allows a node to repel a set of pods.
    *   **Tolerations** are applied to Pods. A toleration allows (but does not require) a pod to be scheduled on a node with a matching taint.
*   **Node Affinity / Anti-Affinity:** A set of rules used by the scheduler to determine where a pod can be placed.
    *   **Affinity:** Attracts Pods to a set of nodes (e.g., "place this pod on a node with a GPU").
    *   **Anti-Affinity:** Repels Pods from a set of nodes (e.g., "don't place two instances of my application on the same node").

## Probes

Probes are health checks performed by the `kubelet` on a container.

*   **Liveness Probe:** Indicates whether the container is running. If the liveness probe fails, the `kubelet` kills the container, and the container is subjected to its restart policy.
*   **Readiness Probe:** Indicates whether the container is ready to respond to requests. If the readiness probe fails, the endpoints controller removes the Pod's IP address from the endpoints of all Services that match the Pod.
*   **Startup Probe:** Indicates whether the application within the container is started. All other probes are disabled if a startup probe is provided, until it succeeds.
