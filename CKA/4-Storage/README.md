# Module 4: Storage

This domain covers how Kubernetes handles persistent storage. While containers and Pods are ephemeral, many applications need to store data permanently. Kubernetes provides a powerful framework for managing storage resources in a cluster.

## Volumes

A **Volume** is a directory, possibly with some data in it, which is accessible to the Containers in a Pod. A Kubernetes volume has a defined lifetime, the same as the Pod that encloses it. Consequently, a volume outlives any Containers that run within the Pod, and data is preserved across Container restarts. However, if the Pod is destroyed, the volume is also destroyed.

Kubernetes supports many types of volumes, including:
*   `emptyDir`: A temporary directory that is created when a Pod is assigned to a Node. It is initially empty and is deleted when the Pod is removed from that Node.
*   `hostPath`: Mounts a file or directory from the host node's filesystem into your Pod. (Use with caution, as it can create security risks).
*   Cloud provider volumes like `awsElasticBlockStore`, `gcePersistentDisk`.
*   `configMap`, `secret`: Used to make configuration data and secrets available as files inside a Pod.

## Persistent Storage

To manage durable storage that exists beyond the lifetime of a Pod, Kubernetes uses the following abstractions:

*   **`PersistentVolume` (PV):** A piece of storage in the cluster that has been provisioned by an administrator or dynamically provisioned using Storage Classes. It is a resource in the cluster just like a node is a cluster resource. PVs are volume plugins like Volumes, but have a lifecycle independent of any individual Pod that uses the PV.

*   **`PersistentVolumeClaim` (PVC):** A request for storage by a user. It is similar to a Pod. Pods consume node resources and PVCs consume PV resources. A user requests a certain size and access mode (e.g., read/write once), and the Kubernetes control plane finds a matching PV and **binds** the PVC to it.

*   **`StorageClass`**: Provides a way for administrators to describe the "classes" of storage they offer. Different classes might map to quality-of-service levels, or to backup policies, or to arbitrary policies determined by the cluster administrators. This is the key to **dynamic provisioning**. When a PVC requests a certain StorageClass, the corresponding cloud or storage provider can automatically create a PV to satisfy the claim.

### The Workflow

1.  **Administrator:** Sets up `StorageClass` objects and the underlying storage infrastructure.
2.  **User/Developer:** Creates a `PersistentVolumeClaim` (PVC) requesting a certain amount of storage and a specific `StorageClass`.
3.  **Kubernetes:** The control plane sees the PVC. If the `StorageClass` supports dynamic provisioning, it automatically creates a `PersistentVolume` (PV) that matches the request and binds it to the PVC.
4.  **User/Developer:** Creates a Pod that references the PVC in its `volumes` section. The Pod can now mount this volume and read/write data to it.

### Access Modes

A PersistentVolume can be mounted on a host in any way that is supported by the storage provider. The access modes are:
*   **`ReadWriteOnce` (RWO):** The volume can be mounted as read-write by a single node.
*   **`ReadOnlyMany` (ROX):** The volume can be mounted as read-only by many nodes.
*   **`ReadWriteMany` (RWX):** The volume can be mounted as read-write by many nodes.
*   **`ReadWriteOncePod` (RWOP):** The volume can be mounted as read-write by a single Pod.

### Reclaim Policies

When a user is done with their volume, they can delete the PVC objects. The **Reclaim Policy** for a PersistentVolume tells the cluster what to do with the volume after it has been released of its claim.
*   **`Retain`**: (Default) The PV is not deleted. It goes into a "Released" state and must be manually reclaimed by an administrator.
*   **`Delete`**: The underlying storage asset (e.g., the AWS EBS volume) is deleted along with the PV object.
*   **`Recycle`**: (Deprecated) Performs a basic scrub on the volume and makes it available again for a new claim.
