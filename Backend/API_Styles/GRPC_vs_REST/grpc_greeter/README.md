# gRPC Greeter Service

This directory contains a simple Go-based gRPC "Greeter" service.

## How to Run (Requires Go and Protoc)

**1. Install Dependencies:**

First, you need to install the `protoc` compiler and the Go plugins for gRPC.

-   [Install Protocol Buffers Compiler](https://grpc.io/docs/protoc-installation/)
-   Install Go plugins:
    ```sh
    go install google.golang.org/protobuf/cmd/protoc-gen-go@v1.28
    go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@v1.2
    ```
    Ensure your `GOPATH/bin` is in your `PATH`.

**2. Generate Protobuf Code:**

From the `grpc_greeter` directory, run the `protoc` compiler to generate the Go code from the `.proto` file.

```sh
protoc --go_out=. --go_opt=paths=source_relative \
    --go-grpc_out=. --go-grpc_opt=paths=source_relative \
    proto/greeter.proto
```

This will create `greeter.pb.go` and `greeter_grpc.pb.go` in the `proto` directory.

**3. Initialize Go Module:**

Initialize the Go module and fetch dependencies.

```sh
go mod init grpc_greeter
go mod tidy
```

**4. Run the Server:**

Open a terminal and run the server.

```sh
go run server.go
```

**5. Run the Client:**

Open a second terminal and run the client.

```sh
go run client.go
# Or with a name
go run client.go "YourName"
```
