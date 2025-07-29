# GraphQL Greeter Service

This directory contains a simple Node.js-based GraphQL "Greeter" service using Express.

## How to Run (Requires Node.js and npm)

**1. Install Dependencies:**

From this `graphql_greeter` directory, install the necessary npm packages.

```sh
npm install
```

**2. Run the Server:**

Start the GraphQL server.

```sh
npm start
```

The server will be running at `http://localhost:4000/graphql`.

**3. Use the GraphiQL Interface:**

Open your web browser and navigate to `http://localhost:4000/graphql`. You will see the GraphiQL interface, which allows you to interactively explore the API and run queries.

**Sample Query:**

Enter the following query in the left-hand panel and press the "Play" button:

```graphql
query {
  hello(name: "GraphQL")
}
```

**Expected Response:**

You will see the JSON response in the right-hand panel:

```json
{
  "data": {
    "hello": "Hello GraphQL!"
  }
}
```
