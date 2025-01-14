# Ansopedia User Service

The Ansopedia User Service is a backend service responsible for managing user accounts and authentication within the Ansopedia learning platform. It provides functionalities like:

- **User Registration and Login:** Enables users to create new accounts and securely log in to the platform.
- **User Management:** Offers APIs to manage user profiles, preferences, and potentially user roles (if permission levels exist).
- **Authentication:** Implements robust authentication mechanisms (e.g., JWT tokens) to secure access to Ansopedia features and resources.
- **Integration:** Collaborates with other services like Ansopedia Studio API to manage user permissions for content creation and interaction.

## Understanding the Scripts

Before we dive into the setup steps, let's break down the scripts in your `package.json` file:

- **build:** Transpiles TypeScript code to JavaScript.
- **dev:** Starts the development server with nodemon for hot reloading.
- **lint:** Lints the codebase using ESLint.
- **lint:fix:** Automatically fixes lint errors.
- **prepare:** Runs husky pre-commit hooks.
- **pretest:** Builds the project before running tests.
- **prettier:check:** Checks code formatting.
- **prettier:fix:** Fixes code formatting automatically.
- **prod:** Sets the NODE_ENV to production, builds the project, and starts the server.
- **start:** Starts the development server using ts-node.
- **test:** Runs the test suite.

## Project Setup

Follow these steps to set up the project:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/ansopedia/user-service.git
   cd user-service
   ```

2. **Set up environment variables:**

   ```bash
   cp .env.example .env
   ```

3. **Install dependencies:**

   ```bash
   pnpm install
   ```

4. **Generate RSA Keys:**

   ```bash
   pnpm generate-keys
   ```

   This script generates RSA keys and saves them to the `keys` directory.

5. **Add RSA Keys to Environment:**

   - Open your `.env` file
   - Copy the contents of `private.pem` to the `PRIVATE_KEY` variable
   - Copy the contents of `public.pem` to the `PUBLIC_KEY` variable
   - Make sure to maintain the PEM format, including the BEGIN and END lines

   Example format in `.env`:

   ```env
   PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
   MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSj...
   -----END PRIVATE KEY-----"

   PUBLIC_KEY="-----BEGIN PUBLIC KEY-----
   MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgK...
   -----END PUBLIC KEY-----"
   ```

6. **Verify Setup:**

   ```bash
   pnpm test
   ```

   All test cases should pass if the setup is correct.

7. **Start Development Server:**

   ```bash
   pnpm dev
   ```

## Available Scripts

- **Development:**

  - `pnpm dev`: Start development server with hot reload
  - `pnpm start`: Start server using ts-node

- **Production:**

  - `pnpm build`: Build the project
  - `pnpm prod`: Run in production mode

- **Testing:**

  - `pnpm test`: Run test suite

- **Code Quality:**
  - `pnpm lint`: Check code style
  - `pnpm lint:fix`: Fix code style issues
  - `pnpm prettier:check`: Check formatting
  - `pnpm prettier:fix`: Fix formatting issues

## Security Notes

- Never commit your RSA keys to version control
- In production, use a secure key management service
- Rotate keys periodically following security best practices
- Keep your private key secure and restrict access

## Contributing

We welcome contributions! Please read our [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## Code of Conduct

Please read our [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) for community guidelines.

## Contributors

<a href="https://github.com/ansopedia/user-service/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ansopedia/user-service" />
</a>

## License

This project is licensed under the terms specified in [LICENSE](./LICENSE).
