# Auto Scaling

AWS Auto Scaling monitors your applications and automatically adjusts capacity to maintain steady, predictable performance at the lowest possible cost. With AWS Auto Scaling, it’s easy to set up application scaling for multiple resources across multiple services in minutes.

## Key Concepts

*   **Launch Template / Launch Configuration:** A template that an Auto Scaling group uses to launch EC2 instances. It specifies the AMI, instance type, key pair, security groups, and other launch parameters. (Launch Templates are newer and more flexible than Launch Configurations).
*   **Auto Scaling Group (ASG):** A collection of EC2 instances that are treated as a logical grouping for the purposes of automatic scaling and management. You define a minimum, maximum, and desired number of instances in an ASG.
*   **Scaling Policies:** These define when and how the Auto Scaling group should scale out (add instances) or scale in (remove instances).
    *   **Target Tracking Scaling:** The most common and easiest to configure. You select a metric (like average CPU utilization) and a target value. The ASG will then automatically adjust the number of instances to keep the metric at, or close to, the specified target value.
    *   **Scheduled Scaling:** Scale your application in response to predictable load changes. For example, you can schedule scaling to increase capacity before a known traffic spike.
    *   **Dynamic Scaling (Simple/Step):** Scale based on CloudWatch alarms. Target tracking is a more advanced and preferred type of dynamic scaling.
*   **Cooldown Period:** A period of time after a scaling activity completes during which further scaling activities are suspended. This prevents the ASG from launching or terminating additional instances before the effects of a previous activity are visible.

## How it Works with ELB

Auto Scaling is commonly used with Elastic Load Balancing (ELB). You can attach an ASG to an Application Load Balancer's target group. When the ASG launches a new instance, it is automatically registered with the target group. When it terminates an instance, it is automatically deregistered. This creates a robust, self-healing, and scalable architecture.

## Labs

*   [Lab: Creating a Dynamic Auto Scaling Group](./lab-creating-auto-scaling-group.md)
