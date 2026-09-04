# INTARAA WebGL Website & Backend

INTARAA is a web-based platform that combines a static/HTML-CSS-JavaScript landing website with a Unity WebGL application and a Node.js/Express backend.

<p align="center">
  <img src="/src/views/image/Landing_Page.png" alt="INTARAA Landing Page" width="100%">
</p>

The website provides:

- A public INTARAA landing page
- A Unity WebGL demo hosted directly from the website
- User registration and sign-in
- MongoDB-backed user and session storage
- Protected case-management pages for authenticated users
- Case creation and case listing
- AI conversation handling through OpenAI
- Optional AI voice generation through ElevenLabs
- Chat/session history stored in MongoDB
- Chat scoring
- Password reset through email
- Contact and demo-request email handling through Resend
- Encrypted request/response payloads for the Unity chat endpoints

---

## 1. Project Architecture

The project is a traditional Node.js/Express application serving HTML, CSS, JavaScript, media, and Unity WebGL build files.

```text
Browser
   │
   ├── Public website
   │      ├── index.html
   │      ├── products.html
   │      ├── pricing.html
   │      └── other public pages
   │
   ├── Authentication
   │      ├── signup.html
   │      ├── signin.html
   │      ├── forgot_password.html
   │      └── reset_password.html
   │
   └── Unity WebGL
          └── game_pages/game.html
                    │
                    ▼
              Node.js / Express
                    │
        ┌───────────┼──────────────┐
        ▼           ▼              ▼
    MongoDB      OpenAI        ElevenLabs
        │
        └── Resend / Email services
```

The Express server serves the contents of `src/views` as static files and exposes backend API routes.

---

## 2. Technology Stack

### Frontend

- HTML5
- CSS3
- Vanilla JavaScript
- Unity WebGL
- Font Awesome
- Calendly widget

### Backend

- Node.js
- Express 5
- ES Modules
- Mongoose
- MongoDB
- Express Session
- connect-mongodb-session
- bcrypt
- Multer
- CORS

### AI / External Services

- OpenAI through the `chatgpt` package
- ElevenLabs for text-to-speech
- Resend for transactional/contact emails

### Security / Data Handling

- bcrypt password hashing
- Express sessions stored in MongoDB
- AES-256-CBC encryption for Unity chat payloads
- HMAC-SHA256 integrity verification
- Environment variables for credentials and secrets

---

## 3. Directory Structure

```text
.
├── server.js
├── package.json
├── package-lock.json
├── .gitignore
├── LICENSE
│
└── src/
    ├── config/
    │   └── db.js
    │
    ├── controllers/
    │   ├── authController.js
    │   ├── caseListController.js
    │   ├── caseUploadController.js
    │   ├── chatController.js
    │   ├── chatLogController.js
    │   ├── contactController.js
    │   ├── otpController.js
    │   ├── passwordController.js
    │   ├── scoreChatController.js
    │   └── sessionController.js
    │
    ├── middleware/
    │   ├── CryptoUtil.js
    │   ├── isLoggedIn.js
    │   └── unityHeaders.js
    │
    ├── models/
    │   ├── User.js
    │   ├── case.js
    │   └── caseChat.js
    │
    ├── routes/
    │   ├── authRoutes.js
    │   ├── caseUploadRoutes.js
    │   ├── chatRoutes.js
    │   ├── contactRoutes.js
    │   ├── otpRoute.js
    │   ├── passwordRoutes.js
    │   └── sessionRoutes.js
    │
    └── views/
        ├── index.html
        ├── signin.html
        ├── signup.html
        ├── forgot_password.html
        ├── reset_password.html
        ├── caseList.html
        ├── caseLog.html
        ├── uploadpage.html
        ├── game_pages/
        ├── Builds/
        ├── css/
        ├── js/
        ├── image/
        ├── video/
        └── TemplateData/
```

---

## 4. Running the Project Locally

### Requirements

Install:

- Node.js
- npm
- MongoDB Atlas account or another MongoDB deployment
- API credentials for the services used by the application

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create a `.env` file in the project root.

Example:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority

DATABASE_NAME=<case_model_name>
CHATHISTORY_COLLECTION=<chat_history_model_name>
CASESESSIONID_COLLECTION=<case_session_model_name>

SESSION_SECRET=<strong_random_session_secret>
SHARED_SECRET=<strong_random_encryption_secret>

OPENAI_API_KEY=<your_openai_api_key>
ELEVENLABS_API_KEY=<your_elevenlabs_api_key>

RESEND_API_KEY=<your_resend_api_key>
RESEND_FROM=<verified_sender>
RESEND_TO=<recipient_for_contact_and_demo_emails>

PORT=3000
```

Do **not** commit the real `.env` file to Git.

The repository's `.gitignore` already excludes `.env` files while allowing an `.env.example` file to be committed.

### Start the server

```bash
npm start
```

The application defaults to:

```text
http://localhost:3000
```

---

# 5. Environment Variables

The following environment variables are used by the current source code.

| Variable | Purpose | Required |
|---|---|---|
| `MONGO_URI` | MongoDB connection URI used by Mongoose and the MongoDB session store | Yes |
| `DATABASE_NAME` | Mongoose model name used for the case collection | Yes |
| `CHATHISTORY_COLLECTION` | Mongoose model name used for chat-history data | Yes |
| `CASESESSIONID_COLLECTION` | Mongoose model name used for case/session state | Yes |
| `SESSION_SECRET` | Secret used by `express-session` to sign session cookies | Yes |
| `SHARED_SECRET` | Secret used to derive AES/HMAC keys for Unity payload encryption | Yes |
| `OPENAI_API_KEY` | API key used for AI conversations and chat scoring | Yes |
| `ELEVENLABS_API_KEY` | API key used for AI text-to-speech | Required for audio generation |
| `RESEND_API_KEY` | API key used to send email through Resend | Required for email features |
| `RESEND_FROM` | Verified sender address used by Resend | Required for email features |
| `RESEND_TO` | Destination address for contact/demo submissions | Required for contact/demo email features |
| `PORT` | HTTP server port | Optional; defaults to `3000` |

### Important

Never put API keys, MongoDB credentials, session secrets, or encryption secrets directly into frontend HTML/JavaScript.

Anything sent to the browser can be inspected by the user.

---

# 6. MongoDB

The application uses MongoDB through Mongoose.

The database connection is initialized in:

```text
src/config/db.js
```

The application uses MongoDB for:

- User accounts
- Express sessions
- Cases
- Case/session state
- Chat history

### User accounts

The `User` model contains:

```text
name
email
password
resetToken
resetTokenExpiry
dateCreated
```

Passwords are hashed with bcrypt before being saved.

The MongoDB document therefore stores a bcrypt hash rather than the user's plaintext password.

### Sessions

Express sessions are stored in MongoDB through:

```text
connect-mongodb-session
```

The session collection is configured as:

```text
sessions
```

### Case data

Cases contain fields including:

```text
CaseId
CasePrompt
CaseVoiceId
```

`CaseId` uses `mongoose-sequence` for automatic incrementing.

### Chat history

Chat history stores:

```text
sessionId
caseid
chat[]
```

Each chat entry contains:

```text
question
answer
```

### Case session state

The application also stores AI conversation state, including:

```text
sessionId
caseid
conversationId
parentMessageId
systemPrompt
caseVoiceId
```

---

# 7. Authentication Flow

## Sign Up

The user submits:

```text
signup.html
      │
      ▼
POST /signup
      │
      ▼
authController.signUp()
      │
      ├── Check whether email already exists
      ├── Hash password with bcrypt
      └── Save User document
      │
      ▼
signin.html
```

The password is hashed using bcrypt before it reaches MongoDB.

## Sign In

```text
signin.html
      │
      ▼
POST /signin
      │
      ▼
authController.signIn()
      │
      ├── Find user by email
      ├── Compare bcrypt password hash
      └── Create req.session.user
      │
      ▼
caseList.html
```

The session contains the user's:

```text
id
name
email
```

## Logout

```text
GET /logout
```

destroys the current Express session and redirects to the sign-in page.

---

# 8. Authentication-Protected Features

The `isLoggedIn` middleware checks:

```js
req.session && req.session.user
```

If the user is authenticated, the request continues.

Otherwise the server returns:

```text
401 Unauthorized
```

Currently protected backend routes include:

```text
GET  /caseList
POST /cases
POST /caseUpload
GET  /chatLog
POST /chatLogs
```

The frontend also checks `/session-user` to determine whether the browser currently has an authenticated session.

---

# 9. Unity WebGL Hosting

The Unity application is hosted as static WebGL build files.

The Unity page is:

```text
src/views/game_pages/game.html
```

The page loads the build from:

```text
src/views/Builds/Big_Build/
```

The Unity loader initializes:

```text
Newhope2025.loader.js
Newhope2025.data
Newhope2025.framework.js
Newhope2025.wasm
```

The page also provides:

- Unity loading progress
- Fullscreen support
- Canvas focus
- Audio-context recovery after browser interaction

The Unity build files are intentionally excluded from Git because of their size.

---

# 10. Unity Authentication Flow

The landing page uses `auth_redirect.js` to check:

```text
GET /session-user
```

before allowing the demo button to navigate to the Unity application.

If the user is logged in:

```text
/session-user
    ↓
loggedIn: true
    ↓
Unity demo
```

If the user is not logged in:

```text
/session-user
    ↓
loggedIn: false
    ↓
signin.html
```

The navigation bar also uses `navbarsettings.js` to replace the Sign In link with Sign Out when an active session is detected.

### Important deployment/security note

The current `game.html` itself is a static page and does not contain server-side `isLoggedIn` middleware.

Therefore, the current implementation **guards the normal landing-page entry to the demo through the session check, but does not server-side protect direct access to the Unity HTML URL**.

If strict authentication is required, the Unity page should eventually be served through an authenticated Express route rather than relying only on the frontend redirect.

---

# 11. AI Chat System

The Unity application communicates with:

```text
POST /chat
```

The endpoint is processed through the encryption middleware before reaching the chat controller.

The flow is approximately:

```text
Unity
  │
  │ encrypted request
  ▼
POST /chat
  │
  ▼
decryptPayload()
  │
  ▼
Chat Controller
  │
  ├── Load case
  ├── Load/create case session
  ├── Send message to OpenAI
  ├── Generate optional ElevenLabs audio
  ├── Save conversation state
  └── Save chat history
  │
  ▼
Encrypted response
  │
  ▼
Unity
```

The response contains:

```text
success
response
audio
emotion
```

Audio is returned as Base64 when audio generation is enabled.

---

# 12. Payload Encryption

Unity chat requests/responses use:

```text
AES-256-CBC
HMAC-SHA256
```

The encryption key and MAC key are derived from:

```text
SHARED_SECRET
```

The `CryptoUtil.js` middleware:

1. Reads the encrypted Base64 payload
2. Extracts the IV
3. Extracts the HMAC
4. Verifies the HMAC
5. Decrypts the AES payload
6. Parses the resulting JSON

This mechanism is intended to provide confidentiality and integrity for the Unity API payloads.

---

# 13. Chat Scoring

The Unity/client application can submit conversation data to:

```text
POST /scoreChat
```

The backend asks the AI model to evaluate:

- Relevance
- Coherence
- Informativeness

Each category receives:

```text
score
feedback
```

The response is encrypted before being returned.

---

# 14. Case Management

Authenticated users can access the case-management interface.

### Case list

```text
GET /caseList
POST /cases
```

The case list displays:

- Case ID
- Case description
- Voice ID

### Upload case

```text
GET /caseUpload
POST /caseUpload
```

A case contains:

```text
CasePrompt
CaseVoiceId
```

The voice ID is optional because the backend model has a default voice ID.

---

# 15. Chat History

The developer/admin interface exposes chat history through:

```text
GET /chatLog
POST /chatLogs
```

The chat log page displays:

- Case ID
- Session ID
- Updated time
- Conversation contents

The individual conversation can be opened in a modal.

---

# 16. Password Reset

Password recovery is implemented through:

```text
POST /forgot-password
POST /reset-password
```

The flow is:

```text
Forgot password
      │
      ▼
Find user
      │
      ▼
Generate reset token
      │
      ▼
Store token + expiry in MongoDB
      │
      ▼
Send reset email using Resend
      │
      ▼
User opens reset link
      │
      ▼
New password
      │
      ▼
Hash password with bcrypt
      │
      ▼
Save user
```

Reset tokens expire after the configured 15-minute period in the controller.

---

# 17. Email Services

Resend is used for:

- Password reset emails
- Contact form emails
- Demo/package request emails
- OTP email functionality

The sender must be a valid/verified sender configured with the email provider.

---

# 18. OTP

The project currently contains an OTP endpoint:

```text
POST /send-otp
```

The current implementation uses a temporary hard-coded email address and keeps OTPs in application memory.

This is currently a development/test implementation and should be redesigned before production use.

In particular:

- The email should come from the request or authenticated workflow.
- OTP storage should not rely on process memory.
- OTP values should not be returned in the API response.
- OTP attempts and expiration should be enforced server-side.
- The temporary hard-coded address should be removed.

---

# 19. Development Notes

Start the application with:

```bash
npm start
```

The current package configuration uses:

```json
"start": "node server.js"
```

The project uses ES modules:

```json
"type": "module"
```

---

# 20. MongoDB DNS Workaround

The current database configuration explicitly sets Node.js DNS to Google's public DNS:

```js
import dns from "node:dns";

dns.setServers(["8.8.8.8"]);
```

This was added to resolve MongoDB Atlas SRV lookup failures of the form:

```text
querySrv ECONNREFUSED
```

The DNS configuration executes before the MongoDB session store and Mongoose connection are initialized.

If the underlying network/DNS problem is eventually fixed, this application-level workaround can be reconsidered.

---

# 21. Production Considerations

Before deploying this project publicly, review the following:

### Authentication

- Add server-side authentication protection to the Unity page if direct URL access must be restricted.
- Review every API endpoint that should require authentication.
- Use a strong random `SESSION_SECRET`.

### Encryption

- Use a strong random `SHARED_SECRET`.
- Never expose `SHARED_SECRET` to frontend JavaScript.
- Rotate secrets when necessary.

### Cookies

For production HTTPS deployments, configure secure session cookies appropriately, including:

```text
secure: true
```

and review `sameSite` requirements for the deployment architecture.

### CORS

The current server enables CORS globally.

For production, restrict CORS to trusted origins if cross-origin access is not required.

### OTP

The current OTP implementation is temporary and should not be considered production-ready.

### Error handling

Avoid exposing internal error messages or stack traces to public clients.

### API keys

Never expose:

```text
OPENAI_API_KEY
ELEVENLABS_API_KEY
RESEND_API_KEY
MONGO_URI
SESSION_SECRET
SHARED_SECRET
```

to the frontend or commit them to Git.

---

# 22. Git / Large Unity Builds

The repository intentionally ignores Unity WebGL build output:

```text
src/views/Builds/
```

This is because Unity WebGL builds can contain very large `.data`, `.wasm`, and framework files.

If the WebGL build is required for deployment, it should be uploaded through the deployment process or stored using an appropriate large-file/object-storage solution.

---

# 23. License

See the included `LICENSE` file for the project's licensing terms.

---

## Quick Start

```bash
# Clone/download the project

# Install dependencies
npm install

# Create .env and configure required variables

# Start the server
npm start
```

Then open:

```text
http://localhost:3000
```

The public website is served from `src/views`, while backend routes handle authentication, sessions, MongoDB operations, AI services, email services, and Unity communication.
