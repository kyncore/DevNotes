# Designing Scalable Systems

Scalability is the ability of a system to handle a growing amount of work by adding resources. A scalable system can handle a massive increase in traffic, data, or workload without a significant drop in performance. This guide covers three fundamental components for building such systems: **Microservices**, **Load Balancers**, and **Caching**.

---

## Part 1: Microservices Architecture

Microservices are an architectural style that structures an application as a collection of small, autonomous services, modeled around a business domain. Each service is self-contained, independently deployable, and communicates with other services over well-defined APIs.

### Monolith vs. Microservices

**Monolithic Architecture:** The application is built as a single, unified unit.
-   **Pros:** Simple to develop, test, and deploy initially.
-   **Cons:** Becomes difficult to scale (you must scale the entire application, not just the parts that need it), hard to maintain as it grows, and a single bug can bring down the entire system.

**Microservices Architecture:** The application is broken down into smaller, independent services.
-   **Pros:**
    -   **Scalability:** Each service can be scaled independently. If your `product-search` service is under heavy load, you can add more instances of just that service.
    -   **Resilience:** Failure in one service doesn't necessarily bring down the entire application.
    -   **Flexibility:** Each service can be written in a different programming language and use its own database.
    -   **Maintainability:** Teams can work on different services independently, leading to faster development cycles.
-   **Cons:** Increased operational complexity (you have more things to deploy and monitor), challenges with data consistency across services, and the need for robust inter-service communication.

**Diagram: Monolith vs. Microservices**
```
      +---------------------------------+      +----------------+  +----------------+  +----------------+
      |                                 |      |                |  |                |  |                |
      |         MONOLITH                |      |  Users Service |  | Products Svc   |  |  Orders Service|
      |  +-----------+  +-----------+   |      |                |  |                |  |                |
      |  | Users     |  | Products  |   |      +-------+--------+  +-------+--------+  +-------+--------+
      |  | Logic     |  | Logic     |   |              |                 |                 |
      |  +-----------+  +-----------+   |              +-------- API Gateway -----------+
      |  | Orders    |  | Payments  |   |
      |  | Logic     |  | Logic     |   |
      |  +-----------+  +-----------+   |
      |                                 |
      +---------------------------------+
```

---

## Part 2: Load Balancers

A load balancer is a device or service that acts as a "traffic cop" for your servers. It sits in front of your servers and distributes incoming client requests across multiple servers capable of fulfilling those requests.

### Why Use a Load Balancer?

1.  **Scalability:** Allows you to scale **horizontally** (adding more machines). As traffic increases, you can add more servers behind the load balancer without changing anything for the client.
2.  **High Availability & Redundancy:** If one of your application servers goes down, the load balancer automatically detects this (via health checks) and reroutes traffic to the remaining healthy servers, preventing downtime.
3.  **Improved Performance:** By distributing the load, it ensures that no single server is overwhelmed, leading to faster response times for users.

**Diagram: Load Balancer in Action**
```
                               +------------------+
                               |                  |
+----------+      Request      |  Load Balancer   |
|          | ----------------> |                  |
|  Client  |                   +--+---+---+-------+
|          |                      |   |   |
+----------+                      |   |   +-------------> +-----------------+
                                  |   |                   | App Server 1    |
                                  |   +-----------------> +-----------------+
                                  |                       | App Server 2    |
                                  +---------------------> +-----------------+
                                                          | App Server 3    |
                                                          +-----------------+
```

### Common Load Balancing Algorithms

-   **Round Robin:** Requests are distributed sequentially to each server. Simple but doesn't account for server load.
-   **Least Connections:** The next request is sent to the server with the fewest active connections. This is a smarter approach that accounts for server load.
-   **IP Hash:** The client's IP address is used to determine which server receives the request. This ensures that a user is consistently sent to the same server, which can be useful for session persistence.

---

## Part 3: Caching

A cache is a high-speed data storage layer that stores a subset of data, typically transient in nature, so that future requests for that data are served up faster than is possible by accessing the data's primary storage location.

### Why Use Caching?

1.  **Dramatically Improved Performance:** Reading data from an in-memory cache (like Redis or Memcached) is orders of magnitude faster than reading from a disk-based database.
2.  **Reduced Load on Backend Systems:** By serving requests from the cache, you reduce the number of hits to your database or other backend services. This can significantly lower your database costs and prevent it from becoming a bottleneck.
3.  **Increased Throughput:** Because cached requests are served faster, the application can handle a higher number of total requests per second.

### The Cache-Aside Pattern (Lazy Loading)

This is the most common caching strategy. The application logic is responsible for reading and writing from the cache.

**Diagram: Cache-Aside Flow**
```
+-------------+      1. Request for data
|             | ---------------------------> +-----------------+
| Application |                              |                 |
|             |      2. Check Cache          |      Cache      |
|             | <--------------------------- |    (Redis)      |
+-------------+                              |                 |
      |                                      +--------+--------+
      | 3a. Cache Hit! Return data to client          |
      |                                               | 3b. Cache Miss
      +-----------------------------------------------+
      |
      | 4. Fetch data from Database
      +--------------------------------------> +-------------+
                                               |             |
                                               |  Database   |
      <--------------------------------------+ |             |
      5. Return data to Application            +-------------+
      |
      | 6. Store data in Cache for next time
      +--------------------------------------> +-------------+
                                               |             |
                                               |    Cache    |
      7. Return data to client                 |             |
                                               +-------------+
```

---

## Tying It All Together: A Scalable System

These three concepts work together to create a robust, scalable, and resilient system.

**Diagram: A Complete, Scalable System**
```
+----------+
|          |
|  Users   |
|          |
+----+-----+
     |
     | Request
     v
+--------------------------------+
|         Load Balancer          |
+----+----------------------+----+
     |                      |
     |                      |
     v                      v
+------------------+     +------------------+
| API Gateway / BFF|     | API Gateway / BFF|  <-- (Horizontally Scaled)
+-------+----------+     +------------------+
        |
        | Calls appropriate microservices...
        |
+-------+------------------------------------------------------------------+
|       |                                                                  |
|       v                                                                  v
| +----------------+  (communicates with)  +----------------+         +----------------+
| |  Users Service | ---------------------> | Orders Service |         | Products Svc   |
| +-------+--------+                        +-------+--------+         +-------+--------+
|         |                                         |                        |
|         | 1. Check Cache                          |                        | 1. Check Cache
|         v                                         v                        v
| +----------------+                        +----------------+         +----------------+
| |   User Cache   |                        |  Orders Cache  |         | Product Cache  |
| +----------------+                        +----------------+         +----------------+
|         | 2. On miss, hit DB                      |                        | 2. On miss, hit DB
|         v                                         v                        v
| +----------------+                        +----------------+         +----------------+
| |  Users DB      |                        |  Orders DB     |         | Products DB    |
| +----------------+                        +----------------+         +----------------+
|                                                                                  |
+----------------------------------------------------------------------------------+
```

In this architecture:
1.  The **Load Balancer** distributes incoming traffic across multiple instances of the API Gateway for high availability.
2.  The **API Gateway** routes requests to the appropriate downstream **Microservice**.
3.  Each **Microservice** is responsible for a specific business domain. It first checks its dedicated **Cache** for data to improve performance.
4.  If the data is not in the cache (a cache miss), the service retrieves it from its own **Database** and stores it in the cache for future requests.
5.  Each component (API Gateway, each microservice) can be **scaled independently** by adding more instances and placing them behind their own internal load balancers.
