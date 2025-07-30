# Module 1: Exam Questions & Answers

This section contains questions formatted similarly to what you might encounter in the CKA exam. The key to the CKA is speed and accuracy. Practice these questions in a terminal to get comfortable with the commands.

---

### Question 1

**Task:**
Install a new Kubernetes cluster using `kubeadm`. The control plane node is already prepared with `kubeadm`, `kubelet`, `kubectl`, and a container runtime.
*   Initialize the cluster.
*   Use the Pod network CIDR `10.244.0.0/16`.
*   After initialization, configure `kubectl` for the current user.
*   Install the "Flannel" CNI plugin.
*   Create a join token and command, and save it to a file named `/tmp/join-command.sh`.

**Answer:**

1.  **Initialize the cluster:**
    ```bash
    sudo kubeadm init --pod-network-cidr=10.244.0.0/16
    ```

2.  **Configure kubectl:**
    ```bash
    mkdir -p $HOME/.kube
    sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
    sudo chown $(id -u):$(id -g) $HOME/.kube/config
    ```

3.  **Install Flannel CNI:**
    *   First, find the correct manifest URL from the official Kubernetes or Flannel documentation.
    ```bash
    kubectl apply -f https://raw.githubusercontent.com/flannel-io/flannel/master/Documentation/kube-flannel.yml
    ```

4.  **Create and save the join command:**
    ```bash
    sudo kubeadm token create --print-join-command > /tmp/join-command.sh
    ```

---

### Question 2

**Task:**
A cluster administrator has reported that the cluster's API server certificate will expire soon. Renew only the `kube-apiserver` certificate using `kubeadm`. Do not restart any services.

**Answer:**

1.  **Check certificate expiration to confirm the problem:**
    ```bash
    sudo kubeadm certs check-expiration
    ```

2.  **Renew only the apiserver certificate:**
    *   The `kubeadm certs renew` command allows you to target specific certificates.
    ```bash
    sudo kubeadm certs renew apiserver
    ```

3.  **Verify the renewal:**
    ```bash
    sudo kubeadm certs check-expiration
    # The expiration date for the apiserver certificate should now be updated.
    ```
    *(Note: For the renewal to take effect, the component using the certificate must be restarted. The question specifically says not to restart, so the task is complete after renewing the file on disk.)*

---

### Question 3

**Task:**
You are tasked with performing a backup of the `etcd` cluster. The cluster is a standard `kubeadm` installation.
*   Save a snapshot of `etcd` to the file `/opt/etcd-backup.db`.
*   Verify the integrity of the snapshot.

**Answer:**

1.  **Find the `etcdctl` arguments:**
    *   The `etcd` client pod manifest contains the necessary paths for certs and keys.
    *   `cat /etc/kubernetes/manifests/etcd.yaml` will show the paths to `ca.crt`, `server.crt`, and `server.key`.

2.  **Execute the snapshot command:**
    ```bash
    sudo ETCDCTL_API=3 etcdctl snapshot save /opt/etcd-backup.db \
      --endpoints=https://127.0.0.1:2379 \
      --cacert=/etc/kubernetes/pki/etcd/ca.crt \
      --cert=/etc/kubernetes/pki/etcd/server.crt \
      --key=/etc/kubernetes/pki/etcd/server.key
    ```

3.  **Verify the snapshot:**
    *   Use the `snapshot status` subcommand.
    ```bash
    sudo ETCDCTL_API=3 etcdctl snapshot status /opt/etcd-backup.db
    ```
    *   This command will print the hash and other metadata, confirming the snapshot is valid.

---

### Question 4

**Task:**
A new user, `dev-user`, needs permissions. Create a new `Role` named `pod-reader` in the `default` namespace. This role should only grant permission to `get`, `watch`, and `list` pods.
Then, create a `RoleBinding` named `read-pods` to grant the `pod-reader` role to the user `dev-user`.

**Answer:**

1.  **Create the `Role`:**
    *   Using `kubectl create role` is the fastest way.
    ```bash
    kubectl create role pod-reader --verb=get,watch,list --resource=pods -n default
    ```
    *   **Alternative (YAML):**
    ```bash
    # Create a file role.yaml
    cat <<EOF > role.yaml
    apiVersion: rbac.authorization.k8s.io/v1
    kind: Role
    metadata:
      name: pod-reader
      namespace: default
    rules:
    - apiGroups: [""] # "" indicates the core API group
      resources: ["pods"]
      verbs: ["get", "watch", "list"]
    EOF

    kubectl apply -f role.yaml
    ```

2.  **Create the `RoleBinding`:**
    *   Using `kubectl create rolebinding` is the fastest way.
    ```bash
    kubectl create rolebinding read-pods --role=pod-reader --user=dev-user -n default
    ```
    *   **Alternative (YAML):**
    ```bash
    # Create a file rolebinding.yaml
    cat <<EOF > rolebinding.yaml
    apiVersion: rbac.authorization.k8s.io/v1
    kind: RoleBinding
    metadata:
      name: read-pods
      namespace: default
    subjects:
    - kind: User
      name: dev-user
      apiGroup: rbac.authorization.k8s.io
    roleRef:
      kind: Role
      name: pod-reader
      apiGroup: rbac.authorization.k8s.io
    EOF

    kubectl apply -f rolebinding.yaml
    ```
