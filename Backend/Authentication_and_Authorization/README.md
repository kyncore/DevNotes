# Authentication & Authorization: OAuth and JWT

This guide focuses on the core technologies that power modern security: JSON Web Tokens (JWT) and the OAuth 2.0 framework.

### Authentication vs. Authorization: The Core Distinction

-   **Authentication (AuthN):** Proving you are who you say you are. This is the process of logging in.
-   **Authorization (AuthZ):** Determining what you are allowed to do after you've logged in.

---

## Part 1: JWT (JSON Web Tokens)

A JWT is a compact, self-contained, and secure way of transmitting information between parties as a JSON object. It's the most common technology used for API authentication.

A JWT is "self-contained" because it includes all the necessary information about the user within the token itself, avoiding the need to query a database on every request.

### The Structure of a JWT

A JWT consists of three parts separated by dots (`.`): `header.payload.signature`

**Example Token:**
`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJyb2xlcyI6WyJhZG1pbiIsImVkaXRvciJdfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`

**1. Header (Base64Url Encoded)**
Identifies which algorithm was used to generate the signature.
```json
{
  "alg": "HS256", // HMAC using SHA-256
  "typ": "JWT"
}
```

**2. Payload (Base64Url Encoded)**
Contains the "claims" or data about the user and the token itself.
-   **Registered Claims:** Standard claims like `iss` (issuer), `exp` (expiration time), `sub` (subject/user ID).
-   **Public Claims:** Custom claims defined by you.
```json
{
  "sub": "1234567890", // Subject (the user's ID)
  "name": "John Doe",
  "iat": 1516239022, // Issued at (timestamp)
  "roles": ["admin", "editor"] // Custom claim for authorization
}
```

**3. Signature**
This is the most important part for security. The signature is created by taking the encoded header, the encoded payload, a secret key, and signing them with the algorithm specified in the header.
```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  your_secret_key
)
```
**How it provides security:** Only the server knows the `secret_key`. If a user tampers with the payload (e.g., adds `"roles": ["super_admin"]`), the signature will no longer be valid when the server re-calculates it. This makes JWTs **tamper-proof**.

---

## Part 2: The Token-Based Authentication Flow

This is the most common authentication pattern for modern web and mobile applications.

**Diagram:**
```
+-----------+      1. POST /login {email, password}
|           | ----------------------------------------> +--------------+
|  Client   |                                           |              |
| (Browser/ |      2. Validate credentials              |  API Server  |
|  Mobile)  |      3. Create JWT with user info (id, roles) |              |
|           | <---------------------------------------- |              |
+-----------+      4. Return { "token": "jwt.goes.here" } +--------------+
     |
     | 5. Client stores the JWT (e.g., in memory or localStorage)
     |
     | 6. GET /protected-resource
     |    Header: "Authorization: Bearer <jwt>"
     +------------------------------------------------> +--------------+
                                                        |              |
           7. Server middleware verifies JWT signature  |  API Server  |
           8. If valid, extracts user info from payload |              |
              and processes the request.                |              |
           <--------------------------------------------+--------------+
           9. Return requested data
```

### Pseudocode for an API Server
```javascript
// 1. Login Endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await db.findUserByEmail(email);

  // Authenticate the user
  if (!user || !bcrypt.compare(password, user.passwordHash)) {
    return res.status(401).send('Invalid credentials.');
  }

  // Create the JWT Payload
  const payload = {
    userId: user.id,
    roles: user.roles
  };

  // Sign the JWT with a secret key
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

  // Send the token to the client
  res.json({ token });
});


// 2. Middleware to protect routes
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <TOKEN>

  if (token == null) return res.sendStatus(401); // No token

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Token is invalid or expired
    
    // Add the payload to the request object for use in other routes
    req.user = user; 
    next();
  });
}

// 3. A protected route
app.get('/profile', authenticateToken, (req, res) => {
  // Because of the middleware, we know who the user is from req.user
  res.json({ message: `Welcome user ${req.user.userId}` });
});
```

---

## Part 3: OAuth 2.0 - Delegated Authorization

As covered previously, OAuth 2.0 is a framework for **delegation**. It's about a user giving one application permission to access their data in another application.

### How JWT and OAuth 2.0 Relate

1.  **Access Tokens can be JWTs:** In an OAuth 2.0 flow, the `access_token` that the Authorization Server gives to the Client can be a JWT. This is a common implementation choice. When the Client uses this token to talk to the Resource Server, the Resource Server can validate the JWT locally without having to call back to the Authorization Server, making the process very efficient.

2.  **OpenID Connect (OIDC):** OIDC is a thin layer on top of OAuth 2.0 that standardizes the authentication part. When you use an OIDC flow (like "Login with Google"), the Authorization Server returns an extra token called an `id_token` in addition to the `access_token`. This `id_token` **is always a JWT** and contains identity information about the user (their ID, email, name, etc.).

## Summary

| Concept | Type          | Primary Purpose                                      | How it's Used                                                              |
|---------|---------------|------------------------------------------------------|----------------------------------------------------------------------------|
| **JWT** | A **technology** (a token format). | To securely transmit information in a compact, self-contained way. | The "ID card" a client shows to the server on every API request to prove who they are. |
| **OAuth 2.0** | A **framework** (a set of rules/flows). | To allow a third-party app to access a user's data on their behalf. | The process of getting permission. It *produces* an access token, which might be a JWT. |

**The most common pattern:**
-   A user logs into your application directly -> You generate a **JWT** for them.
-   A user logs into your application via "Login with Google" -> You use **OAuth 2.0/OIDC** to get an `id_token` (a JWT) from Google to verify their identity. You might then create your *own* JWT to manage their session within your app.
