# Authorization Flows: RBAC, OAuth 2.0, and SSO

First, a critical distinction:
-   **Authentication (AuthN):** Verifying who you are. (e.g., logging in with a username and password).
-   **Authorization (AuthZ):** Determining what you are allowed to do. (e.g., a user can read a document but cannot delete it).

This guide focuses on Authorization.

---

## 1. RBAC (Role-Based Access Control)

RBAC is a method of restricting system access to authorized users based on their roles within an organization. It's an internal authorization strategy for your own application.

### Core Concept

-   **Users** are assigned one or more **Roles**.
-   **Roles** are granted one or more **Permissions**.
-   A **Permission** is a specific action that can be performed (e.g., `create-document`, `delete-user`).

This decouples users from permissions. Instead of assigning permissions directly to each user, you manage a smaller set of roles.

**Diagram:**
```
+-------+       (has)       +-------+      (has)      +-------------+
|       | <---------------- |       | ---------------> |             |
| User  |                   | Role  |                  | Permission  |
|       | ----------------> |       | <--------------- |             |
+-------+     (many-to-many)  +-------+    (many-to-many)  +-------------+
  (e.g., Alice)             (e.g., "Admin", "Editor")   (e.g., "delete-posts")
```

### Real-World Example: A Blogging Platform

**Database Schema:**
```sql
-- Users of the platform
CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(255)
);

-- Available roles
CREATE TABLE roles (
    id INT PRIMARY KEY,
    name VARCHAR(255) UNIQUE -- e.g., 'Admin', 'Editor', 'Viewer'
);

-- Specific permissions
CREATE TABLE permissions (
    id INT PRIMARY KEY,
    name VARCHAR(255) UNIQUE -- e.g., 'create-post', 'edit-post', 'delete-post'
);

-- Link users to roles (many-to-many)
CREATE TABLE user_roles (
    user_id INT,
    role_id INT,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Link roles to permissions (many-to-many)
CREATE TABLE role_permissions (
    role_id INT,
    permission_id INT,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (permission_id) REFERENCES permissions(id)
);
```

**Authorization Check (Pseudocode):**
This function would be used in your API to protect an endpoint.
```javascript
async function hasPermission(userId, requiredPermission) {
  // 1. Find the permission's ID
  const permission = await db.query(
    "SELECT id FROM permissions WHERE name = ?", [requiredPermission]
  );
  if (!permission) return false;

  // 2. Find all roles assigned to the user
  const userRoles = await db.query(
    "SELECT role_id FROM user_roles WHERE user_id = ?", [userId]
  );
  const roleIds = userRoles.map(r => r.role_id);
  if (roleIds.length === 0) return false;

  // 3. Check if any of the user's roles have the required permission
  const matchingRole = await db.query(
    "SELECT role_id FROM role_permissions WHERE permission_id = ? AND role_id IN (?)",
    [permission.id, roleIds]
  );

  // If we found at least one role with that permission, access is granted
  return matchingRole !== null;
}

// Example usage in an API route
app.delete('/posts/:id', async (req, res) => {
  const canDelete = await hasPermission(req.currentUser.id, 'delete-post');
  if (!canDelete) {
    return res.status(403).send("Forbidden: You don't have permission to delete posts.");
  }
  // ... proceed with deletion logic
});
```

---

## 2. OAuth 2.0 (Open Authorization)

OAuth 2.0 is a framework for **delegated authorization**. It allows a third-party application (the **Client**) to access a user's data from another service (the **Resource Server**) on the user's behalf, without giving the client the user's password.

### Core Concept & Roles

-   **Resource Owner:** The user who owns the data.
-   **Client:** The third-party application that wants to access the user's data (e.g., a photo printing service).
-   **Authorization Server:** The service that knows the user and issues access tokens (e.g., Google's login service).
-   **Resource Server:** The API that hosts the user's data (e.g., Google Photos API).

### Authorization Code Grant Flow (Most Common)

This is the flow you see with "Log in with Google/Facebook" buttons.

**Diagram:**
```
+----------+      (A) User clicks "Login with Google"
|          | -------------------------------------------------> +--------------------+
|  Client  |                                                    |                    |
| (e.g.,   |      (B) Redirect to Google with client_id         | Authorization      |
|  Canva)  | <------------------------------------------------- | Server (Google)    |
|          |      (C) User logs in, grants permission           |                    |
+----------+ -------------------------------------------------> |                    |
     ^       (D) Google redirects back with an authorization_code|                    |
     |       ------------------------------------------------- > +--------------------+
     |                                                                   |
     | (E) Client sends authorization_code + client_secret to Google     |
     | ------------------------------------------------------------------+
     |                                                                   |
     | (F) Google validates code, returns access_token                   |
     +-------------------------------------------------------------------+
     |
     | (G) Client uses access_token to request user's photos
     +-----------------------------------------------------> +------------------+
                                                           |                  |
                                                           |  Resource Server |
                                                           | (Google Photos)  |
                                                           |                  |
                                                           +------------------+
```

### Key Takeaway

OAuth 2.0 is **not about authentication**, it's about **access**. The `access_token` represents the permission (scope) the user granted to the client. The client doesn't know who the user is, only that it has permission to access certain resources.

---

## 3. SSO (Single Sign-On)

SSO is an **authentication** scheme that allows a user to log in with a single ID and password to gain access to multiple, independent software systems.

### Core Concept

SSO's main goal is to establish a user's identity and then share that identity securely with multiple applications. It's built on top of standards like **SAML** and **OpenID Connect (OIDC)**.

**OIDC is an identity layer built on top of OAuth 2.0.** It adds an `id_token` (a JSON Web Token - JWT) to the standard OAuth 2.0 flow. This token contains verifiable information about the user's identity.

**Diagram (SSO with OIDC):**
```
+-----------+      1. User tries to access Service Provider A
|           | ------------------------------------------------> +--------------------+
|   User    |                                                   | Service Provider A |
|           |      2. SP A sees no session, redirects to IdP      |   (e.g., Jira)   |
|           | <------------------------------------------------ |                    |
+-----------+      3. User logs into IdP                         +--------------------+
     |       ------------------------------------------------> +--------------------+
     |                                                         | Identity Provider  |
     |       4. IdP sets a cookie, redirects back to SP A      |   (e.g., Okta)   |
     |          with an authorization_code                     |                    |
     +------------------------------------------------------- > +--------------------+
                                                                        |
     5. SP A exchanges code for id_token + access_token, creates a session for the user
                                                                        |
+-----------+      6. User now tries to access Service Provider B
|           | ------------------------------------------------> +--------------------+
|   User    |                                                   | Service Provider B |
|           |      7. SP B sees no session, redirects to IdP      |  (e.g., GitHub)  |
|           | <------------------------------------------------ |                    |
+-----------+      8. IdP sees the user's cookie, knows they are +--------------------+
     |          already logged in. It immediately redirects     | Identity Provider  |
     |          back to SP B with a new authorization_code.     |   (e.g., Okta)   |
     |          **No password required!**                         |                    |
     +------------------------------------------------------- > +--------------------+
```

## Summary: How They Relate

| Concept       | What It Is                                     | Primary Use Case                                                              | Key Idea                                                              |
|---------------|------------------------------------------------|-------------------------------------------------------------------------------|-----------------------------------------------------------------------|
| **RBAC**      | An **internal authorization** strategy.        | Controlling what users can do *within your own application*.                  | Users have Roles, Roles have Permissions.                             |
| **OAuth 2.0** | A framework for **delegated authorization**.   | Allowing a third-party app to access a user's data on their behalf.           | "Can Canva access my Google Photos?" -> `access_token`                |
| **SSO**       | An **external authentication** mechanism.      | Logging into multiple applications with one set of credentials.               | "Log in with Google/Okta to access Jira, GitHub, and Slack."          |

-   You use **SSO** (often with OIDC) to authenticate a user.
-   The **OIDC** flow is built on **OAuth 2.0**.
-   Once the user is authenticated and inside your application, you use **RBAC** to determine what they are authorized to do.
