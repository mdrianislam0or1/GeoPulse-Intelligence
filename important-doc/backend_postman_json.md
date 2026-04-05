You are a senior backend engineer and API automation expert.

I will provide you with a Node.js backend project. Your main entry point for routes is:

@backend_project/src/routes/index.ts

Your task is to analyze the entire routing system and generate a complete, production-ready Postman collection (postman.json) with proper scripting and request flows using an AI code loop.

---

## 🎯 Objective

* Generate a full Postman collection for ALL modules and endpoints
* Maintain correct API flow and dependencies
* Include scripts for token handling, dynamic variables, and chaining requests

---

## 🔁 AI Code Loop Process

### Step 1: Route Discovery

* Start from `@backend_project/src/routes/index.ts`
* Traverse all imported route modules recursively
* Identify:

  * सभी endpoints (GET, POST, PUT, DELETE)
  * Full route paths (including prefixes)
  * संबंधित controllers and services

---

### Step 2: Endpoint Analysis

For EACH endpoint:

* Identify:

  * Method (GET/POST/PUT/DELETE)
  * Full URL
  * Request body संरचना (from validation schema যেমন Zod/Joi)
  * Query params / path params
  * Headers (auth, content-type)
  * Response structure

---

### Step 3: Auth & Flow Mapping

* Detect authentication प्रणाली (JWT, session, etc.)
* Identify:

  * Login / register endpoints
  * Token प्राप्त flow
* Map API dependencies:

  * Example:

    * Login → get token → use token in protected routes
    * Create resource → use ID in next request

---

### Step 4: Postman Collection Generation

Generate a complete `postman.json` with:

#### 📁 Structure

* Folder per module
* Requests grouped logically

#### 📌 Each Request Must Include:

* Method & URL
* Headers:

  * Content-Type
  * Authorization (Bearer {{token}})
* Body (raw JSON / form-data if needed)
* Query params / path params

---

### Step 5: Postman Scripts (VERY IMPORTANT)

#### 🔐 Auth Script

* Store token after login:

```js
pm.environment.set("token", pm.response.json().accessToken);
```

#### 📦 Dynamic Data Scripts

* Store IDs:

```js
pm.environment.set("userId", pm.response.json().data.id);
```

#### 🔁 Pre-request Scripts

* Auto attach token:

```js
pm.request.headers.add({
  key: "Authorization",
  value: "Bearer " + pm.environment.get("token")
});
```

---

### Step 6: Flow Maintenance

* Ensure correct execution order:

  1. Auth (login/register)
  2. Core resource creation
  3. Dependent APIs
* Use saved variables across requests

---

### Step 7: Validation & Completeness

* Ensure:

  * No endpoint is missing
  * सही request payload
  * सही headers
  * No broken routes
* Match everything with actual code (controllers, schemas, services)

---

## 📦 Output Format

You must provide:

1. 📁 Complete `postman.json` (ready to import)
2. 🧾 Summary of all modules and endpoints
3. 🔐 Auth flow explanation
4. 🔁 Variable usage (token, ids, etc.)
5. ⚠️ Any assumptions or missing schema details

---

## ⚡ Rules

* Do NOT skip any route/module
* Do NOT assume — extract from actual code
* Maintain real API flow
* Ensure production-level accuracy
* Use clean naming for requests and folders

---

Now start analyzing the route file and begin the AI code loop to generate the Postman collection.
