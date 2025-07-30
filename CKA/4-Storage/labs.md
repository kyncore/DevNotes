# Module 4: Labs

These labs focus on providing persistent storage to applications.

---

### Lab 1: Creating and Using a PersistentVolumeClaim

**Objective:** Create a Pod that persists data using a `PersistentVolumeClaim` with dynamic provisioning. This lab assumes your cluster has a default `StorageClass` configured (most managed clusters and `kubeadm` setups with a cloud provider do).

**Instructions:**

1.  **Create a PersistentVolumeClaim (PVC):**
    *   Create a YAML file named `my-pvc.yaml`. This PVC will request 1 GiB of storage.
    ```yaml
    apiVersion: v1
    kind: PersistentVolumeClaim
    metadata:
      name: my-app-pvc
    spec:
      accessModes:
        - ReadWriteOnce
      resources:
        requests:
          storage: 1Gi
    ```
    *   Apply it: `kubectl apply -f my-pvc.yaml`.

2.  **Verify the PVC and PV:**
    *   Check the status of the PVC. It should become `Bound`.
        ```bash
        kubectl get pvc my-app-pvc
        ```
    *   Check the PersistentVolumes. You should see a new PV that was dynamically created to satisfy your claim.
        ```bash
        kubectl get pv
        ```

3.  **Create a Pod that uses the PVC:**
    *   Create a YAML file named `storage-pod.yaml`. This pod will mount the volume and write the current date into a file every 5 seconds.
    ```yaml
    apiVersion: v1
    kind: Pod
    metadata:
      name: storage-test-pod
    spec:
      containers:
      - name: writer
        image: busybox
        command: ["/bin/sh", "-c", "while true; do date >> /data/output.txt; sleep 5; done"]
        volumeMounts:
        - name: my-storage
          mountPath: /data
      volumes:
      - name: my-storage
        persistentVolumeClaim:
          claimName: my-app-pvc
    ```
    *   Apply it: `kubectl apply -f storage-pod.yaml`.

4.  **Verify Data Persistence:**
    *   Wait a few moments, then check the contents of the file inside the pod.
        ```bash
        kubectl exec -it storage-test-pod -- cat /data/output.txt
        ```
    *   Now, delete the pod: `kubectl delete pod storage-test-pod`.
    *   Re-create the pod: `kubectl apply -f storage-pod.yaml`.
    *   Exec into the new pod and check the file again.
        ```bash
        kubectl exec -it storage-test-pod -- cat /data/output.txt
        ```
    *   You will see that the old data is still there, demonstrating that the data persisted even though the pod was destroyed.

5.  **Clean Up:**
    ```bash
    kubectl delete pod storage-test-pod
    kubectl delete pvc my-app-pvc
    # The PV will be deleted automatically because the default reclaim policy for dynamic provisioning is 'Delete'.
    ```

---

### Lab 2: Manually Provisioning a PersistentVolume

**Objective:** Manually create a `PersistentVolume` and have a `PersistentVolumeClaim` bind to it. This is common in on-premises environments without a dynamic provisioner. We will simulate this using a `hostPath` volume.

**Instructions:**

1.  **On one of your worker nodes:**
    *   Create a directory that will act as our storage.
        ```bash
        # Run this on the worker node's shell
        sudo mkdir /mnt/my-storage
        sudo chmod 777 /mnt/my-storage
        ```

2.  **Create a PersistentVolume (PV):**
    *   Create a YAML file named `my-pv.yaml`. This PV will represent the `hostPath` directory we just created.
    ```yaml
    apiVersion: v1
    kind: PersistentVolume
    metadata:
      name: my-manual-pv
    spec:
      capacity:
        storage: 500Mi
      accessModes:
        - ReadWriteOnce
      hostPath:
        path: "/mnt/my-storage"
      storageClassName: manual # We give it a custom class name
    ```
    *   Apply it: `kubectl apply -f my-pv.yaml`.
    *   Check its status. It should be `Available`: `kubectl get pv my-manual-pv`.

3.  **Create a PersistentVolumeClaim (PVC) to match the PV:**
    *   Create a YAML file named `my-manual-pvc.yaml`. It's crucial that the `storageClassName`, `accessModes`, and requested `storage` size are compatible with the PV.
    ```yaml
    apiVersion: v1
    kind: PersistentVolumeClaim
    metadata:
      name: my-manual-pvc
    spec:
      accessModes:
        - ReadWriteOnce
      resources:
        requests:
          storage: 200Mi # Requesting less than is available
      storageClassName: manual # Must match the PV's storage class
    ```
    *   Apply it: `kubectl apply -f my-manual-pvc.yaml`.

4.  **Verify the Binding:**
    *   Check the status of both the PV and PVC. They should now both be `Bound`.
        ```bash
        kubectl get pv my-manual-pv
        kubectl get pvc my-manual-pvc
        ```

5.  **Use the PVC in a Pod:**
    *   Create a pod that uses `my-manual-pvc`. You can reuse the pod manifest from Lab 1, just change the `claimName`.
        ```bash
        # ...
        persistentVolumeClaim:
          claimName: my-manual-pvc
        # ...
        ```
    *   Apply the pod manifest.

6.  **Clean Up:**
    ```bash
    kubectl delete pod <your-pod-name>
    kubectl delete pvc my-manual-pvc
    kubectl delete pv my-manual-pv
    # On the worker node, remove the directory: sudo rm -rf /mnt/my-storage
    ```
