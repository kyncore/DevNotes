# Module 5: External Resources

Troubleshooting is a skill learned by practice. Use these resources to understand common failure modes and learn systematic approaches to debugging.

## Official Kubernetes Documentation

The "Tasks > Monitor, Log, and Debug" section of the documentation is your most valuable resource.

*   **Application Introspection and Debugging:**
    *   [Debug a Running Pod](https://kubernetes.io/docs/tasks/debug/debug-application/debug-pod/)
    *   [Debug Init Containers](https://kubernetes.io/docs/tasks/debug/debug-application/debug-init-containers/)
    *   [Get a Shell to a Running Container](https://kubernetes.io/docs/tasks/debug/debug-application/get-shell-running-container/) (using `kubectl exec`)

*   **Cluster Troubleshooting:**
    *   [Troubleshooting Clusters](https://kubernetes.io/docs/tasks/debug/debug-cluster/) (This is a master page with many sub-links)
    *   [Debugging DNS Resolution](https://kubernetes.io/docs/tasks/administer-cluster/dns-debugging-resolution/)
    *   [Auditing](https://kubernetes.io/docs/tasks/debug/debug-cluster/audit/)

*   **`kubectl` Commands:**
    *   [Kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
    *   [Overview of kubectl](https://kubernetes.io/docs/reference/kubectl/)
    *   [JSONPath Support](https://kubernetes.io/docs/reference/kubectl/jsonpath/) (Essential for quickly extracting information)

## Other Useful Resources

*   **Practice Environments:**
    *   [Killer.sh](https://killer.sh/): This is a CKA exam simulator that is famous for being harder than the real exam. If you can pass this, you are ready. The Linux Foundation provides one free session when you purchase the CKA exam.
    *   [Katacoda Scenarios](https://www.katacoda.com/courses/kubernetes/troubleshooting): Interactive troubleshooting scenarios in a live environment.

*   **Community Tutorials & Articles:**
    *   [The Ultimate CKA Troubleshooting Guide](https://www.cncf.io/blog/2021/11/18/the-ultimate-cka-troubleshooting-guide/)
    *   [How to Troubleshoot Kubernetes OOM and CPU Throttling](https://sysdig.com/blog/troubleshoot-kubernetes-oom-cpu-throttling/)
    *   [A visual guide on troubleshooting Kubernetes deployments](https://learnk8s.io/troubleshooting-deployments) by Learnk8s.
