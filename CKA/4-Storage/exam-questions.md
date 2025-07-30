# Module 4: Exam Questions & Answers

These questions focus on provisioning storage for applications.

---

### Question 1

**Task:**
Create a new `PersistentVolumeClaim` named `data-pvc` in the `default` namespace.
*   It should request `2Gi` of storage.
*   It should have the access mode `ReadWriteOnce`.
*   It should use the `standard` storage class.

**Answer:**

1.  **You must create a YAML file for a PVC.** There is no simple `kubectl create pvc` command.

2.  **Create the YAML file `pvc.yaml`:**
    ```yaml
    apiVersion: v1
    kind: PersistentVolumeClaim
    metadata:
      name: data-pvc
      namespace: default
    spec:
      accessModes:
        - ReadWriteOnce
      resources:
        requests:
          storage: 2Gi
      storageClassName: standard
    ```

3.  **Apply the manifest:**
    ```bash
    kubectl apply -f pvc.yaml
    ```

4.  **Verification:**
    ```bash
    kubectl get pvc data-pvc
    # The status should be 'Pending' if no matching PV/StorageClass is available, or 'Bound' if it is.
    ```

---

### Question 2

**Task:**
A pod needs access to configuration data.
*   Create a `ConfigMap` named `app-config` with the data `database.host=mysql.example.com`.
*   Create a new pod named `config-test-pod` using the `busybox` image.
*   The pod should run the command `sleep 3600`.
*   Mount the `ConfigMap` as a volume into the pod at the path `/etc/config`.

**Answer:**

1.  **Create the ConfigMap:**
    *   The fastest way is using `kubectl create configmap` with the `--from-literal` flag.
    ```bash
    kubectl create configmap app-config --from-literal=database.host=mysql.example.com
    ```

2.  **Create the Pod YAML:**
    *   You can generate a base YAML using `--dry-run`.
    ```bash
    kubectl run config-test-pod --image=busybox --dry-run=client -o yaml -- sleep 3600 > pod.yaml
    ```
    *   Now, edit `pod.yaml` to add the volume and volume mount.
    ```yaml
    apiVersion: v1
    kind: Pod
    metadata:
      name: config-test-pod
    spec:
      containers:
      - name: config-test-pod
        image: busybox
        command: ["sleep", "3600"]
        volumeMounts:
        - name: config-volume
          mountPath: /etc/config
      volumes:
      - name: config-volume
        configMap:
          name: app-config
    ```

3.  **Apply the pod manifest:**
    ```bash
    kubectl apply -f pod.yaml
    ```

4.  **Verification:**
    *   Exec into the pod and check if the file exists and has the correct content. The key `database.host` becomes the filename.
    ```bash
    kubectl exec -it config-test-pod -- cat /etc/config/database.host
    # This should output: mysql.example.com
    ```

---

### Question 3

**Task:**
A `PersistentVolume` named `pv-log` has been created.
*   Find out its capacity.
*   Write the capacity (e.g., `5Gi`, `100Mi`) to the file `/tmp/pv-capacity.txt`.

**Scenario Setup (for practice):**
```bash
cat <<EOF > pv.yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv-log
spec:
  capacity:
    storage: 2Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: "/tmp/log"
  storageClassName: manual
EOF
kubectl apply -f pv.yaml
```

**Answer:**

1.  **Use `kubectl get` with `jsonpath` to extract the information directly.** This is much faster than using `describe` and manually copying.
    ```bash
    kubectl get pv pv-log -o jsonpath='{.spec.capacity.storage}' > /tmp/pv-capacity.txt
    ```

2.  **Verification:**
    ```bash
    cat /tmp/pv-capacity.txt
    # This should output: 2Gi
    ```

---

### Question 4

**Task:**
A pod named `app-pod` needs to be created. It requires persistent storage.
*   Create a `PersistentVolumeClaim` named `app-storage-pvc` that requests `100Mi` of storage with `ReadWriteOnce` access from the `standard` storage class.
*   Create the pod `app-pod` using the `nginx` image.
*   Mount the PVC at the path `/usr/share/nginx/html`.

**Answer:**

1.  **Create the PVC YAML (`pvc.yaml`):**
    ```yaml
    apiVersion: v1
    kind: PersistentVolumeClaim
    metadata:
      name: app-storage-pvc
    spec:
      accessModes:
        - ReadWriteOnce
      resources:
        requests:
          storage: 100Mi
      storageClassName: standard
    ```

2.  **Apply the PVC manifest:**
    ```bash
    kubectl apply -f pvc.yaml
    ```

3.  **Create the Pod YAML (`pod.yaml`):**
    ```yaml
    apiVersion: v1
    kind: Pod
    metadata:
      name: app-pod
    spec:
      containers:
      - name: nginx
        image: nginx
        volumeMounts:
        - name: web-storage
          mountPath: /usr/share/nginx/html
      volumes:
      - name: web-storage
        persistentVolumeClaim:
          claimName: app-storage-pvc
    ```

4.  **Apply the Pod manifest:**
    ```bash
    kubectl apply -f pod.yaml
    ```

5.  **Verification:**
    *   Check that the pod is running: `kubectl get pod app-pod`.
    *   Exec into the pod and create a file in the mounted directory.
        ```bash
        kubectl exec -it app-pod -- sh -c 'echo "Hello from persistent storage" > /usr/share/nginx/html/index.html'
        ```
    *   This demonstrates the volume is writable.
