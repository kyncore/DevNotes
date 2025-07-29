# REST Greeter Service

This directory contains a simple Go-based RESTful "Greeter" service.

## How to Run (Requires Go)

**1. Initialize Go Module:**

Initialize the Go module.

```sh
go mod init rest_greeter
go mod tidy
```

**2. Run the Server:**

Open a terminal and run the server.

```sh
go run server.go
```

The server will be listening on `http://localhost:8080`.

**3. Call the API:**

Open a second terminal and use `curl` to send a request to the server.

```sh
curl -X POST -H "Content-Type: application/json" \
  -d '{"name": "world"}' \
  http://localhost:8080/greet
```

You should receive the following response:

```json
{"message":"Hello world"}
```
