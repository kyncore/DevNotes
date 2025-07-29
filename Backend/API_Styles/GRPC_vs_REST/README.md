# gRPC vs. REST APIs

## Core Explanation

This section provides a detailed explanation of REST and gRPC, two popular paradigms for building APIs.

### What is REST?

REST (REpresentational State Transfer) is an architectural style that defines a set of constraints for creating web services. It is not a protocol or a standard but a set of guidelines that use standard HTTP methods.

-   **Paradigm:** Client-Server model where the server provides access to resources, and the client manipulates them.
-   **Stateless:** Each request from a client to a server must contain all the information needed to understand and complete the request. The server does not store any client context between requests.
-   **Resource-Based:** APIs are designed around resources (e.g., users, products), which are identified by URIs (e.g., `/users/123`).
-   **Standard HTTP Methods:** Uses standard HTTP verbs for operations (e.g., `GET` to retrieve, `POST` to create, `PUT` to update, `DELETE` to remove).
-   **Data Format:** Typically uses JSON for transmitting data, although it can use XML or other formats. It's human-readable and flexible.

### What is gRPC?

gRPC (gRPC Remote Procedure Call) is a modern, open-source, high-performance RPC framework that can run in any environment. It was developed by Google.

-   **Paradigm:** Based on the idea of a client application directly calling a method on a server application on a different machine as if it were a local object.
-   **Contract-First:** Uses **Protocol Buffers (`.proto` files)** to define the service contract. This contract specifies the available RPC methods, their parameters, and return types. Code for the client and server is then generated from this contract.
-   **High Performance:** gRPC is built on **HTTP/2**, which supports multiplexing (sending multiple requests over a single connection), server push, and header compression, leading to lower latency and higher throughput compared to HTTP/1.1 used by most REST APIs.
-   **Data Format:** Uses Protocol Buffers (Protobuf) as its data format. This binary format is more compact and efficient to serialize/deserialize than text-based formats like JSON.
-   **Streaming:** Natively supports bi-directional streaming, allowing the client and server to send a stream of messages to each other over a single gRPC connection.

### What is GraphQL?

GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data. It was developed by Facebook and is now maintained by the GraphQL Foundation.

-   **Paradigm:** Client-driven queries. Instead of the server defining multiple endpoints that return fixed data structures, the client specifies exactly what data it needs in a single request.
-   **Strongly Typed:** Uses a schema to define the data model. The schema defines all the types of data that a client can query and the relationships between them. This is known as the Schema Definition Language (SDL).
-   **Single Endpoint:** Typically exposes a single endpoint (e.g., `/graphql`) that handles all incoming queries. The type of operation (query for reading, mutation for writing) is determined by the query itself.
-   **Hierarchical:** The shape of a GraphQL query mirrors the shape of the data it returns, making it easy to predict the response.
-   **No Over-fetching or Under-fetching:** Because the client specifies its exact data requirements, the server returns exactly that data and nothing more. This solves the common REST issues of fetching too much data (over-fetching) or needing to make multiple requests to get all required data (under-fetching).
-   **Transport Agnostic:** While typically served over HTTP, GraphQL is not tied to any specific transport layer.

### Key Differences

| Feature              | REST                                       | gRPC                                           | GraphQL                                        |
| -------------------- | ------------------------------------------ | ---------------------------------------------- | ---------------------------------------------- |
| **API Paradigm**     | Resource-oriented (nouns) & HTTP verbs     | Service-oriented (verbs) & function calls    | Client-driven queries & mutations              |
| **Data Format**      | JSON (human-readable, flexible)            | Protocol Buffers (binary, strict, efficient)   | JSON (flexible, client-defined shape)          |
| **Transport Protocol** | HTTP/1.1 (typically)                       | HTTP/2                                         | HTTP/1.1 or HTTP/2 (transport agnostic)        |
| **Contract**         | Informal (e.g., OpenAPI/Swagger)           | Formal & required (`.proto` file)              | Formal & required (Schema Definition Language) |
| **Code Generation**  | Optional (tools like Swagger Codegen)      | Built-in and a core part of the workflow       | Optional (tools like Apollo Codegen)           |
| **Streaming**        | Not natively supported (requires workarounds) | Native support for unary, server, client, & bi-directional | Native support for "Subscriptions"             |
| **Performance**      | Good, but JSON parsing can be slow         | Excellent, due to binary format and HTTP/2     | Very good, reduces number of requests          |
| **Browser Support**  | Full native support                        | Limited (requires gRPC-Web proxy)              | Full native support                            |

---

## Sample Projects: Greeter Service

To illustrate the differences, we will build a simple "Greeter" service with one function, `SayHello`, using both gRPC and REST.

## Step-by-Step Explanation

Below are the implementations and explanations for both the gRPC and REST services.

*Note: The following sections will be populated with the code and instructions for each implementation.*

-   **[gRPC Greeter Service](./grpc_greeter/README.md)**
-   **[REST Greeter Service](./rest_greeter/README.md)**
-   **[GraphQL Greeter Service](./graphql_greeter/README.md)**

