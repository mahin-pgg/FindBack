# FindBack
An AI Powered Campus Lost &amp; Found Management System

## Architecture

The project has three runtime components: a React/Vite client on port 5173, an Express/Mongoose API on port 3001, and an optional Flask AI service on port 5000. The API owns authentication, authorization, moderation, matching, claims, image normalization, and MongoDB persistence. The AI service provides text and image embeddings.

## Local setup

1. Install Node.js 18 or newer and MongoDB Atlas or a local MongoDB instance.
2. Copy `server/.env.example` to `server/.env.development` and fill in the values.
3. Install and run the API: `cd server`, `npm install`, `npm run dev`.
4. Install and run the client: `cd client`, `npm install`, `npm run dev`.
5. Open `http://localhost:5173`. API documentation is available at `http://localhost:3001/api-docs` when the API is connected to MongoDB.

## Environment variables

The API requires `DATABASE_URL`, `DATABASE_NAME`, `JWT_SECRET`, and `JWT_ACCESS_EXPIRATION_TTL`. Optional settings include `PORT`, `ALLOWED_ORIGINS`, `UPLOAD_DIR`, `AI_SERVICE_URL`, `AI_SERVICE_TOKEN`, and `AI_TIMEOUT_MS`. Never commit real credentials.

## AI service

Install the Python dependencies used by `ai-service/app.py`, set the same `AI_SERVICE_TOKEN` in the API and AI service environments, then run the Flask app behind a production WSGI server such as Gunicorn. The service limits request size and text length, validates images, and runs with debug mode disabled.

## Security notes

Public registration always creates a normal user. Administrator-only routes require a valid JWT with the `admin` role. Passwords are hashed, JWTs are restricted to HS256, uploads are re-encoded with Sharp, and the API applies Helmet, HPP, Mongo sanitization, CORS allowlisting, request-size limits, and rate limiting. Add the deployment server's public IP to the Atlas project IP access list and allow outbound TCP 27017.

## Production

Use `npm start` in `server` for the Node production process; it uses Node directly and does not run Nodemon. Serve the built client from a static host or CDN, use HTTPS, set `ALLOWED_ORIGINS` explicitly, store uploads in object storage where possible, and run the AI service behind Gunicorn or another production WSGI server.

## Tests

Run `npm test` in `server` to execute the security regression tests. Add integration tests with a test MongoDB instance for registration, blocked login, ownership checks, admin authorization, claims, uploads, and AI timeout behavior before deployment.
