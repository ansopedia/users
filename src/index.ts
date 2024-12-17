import { connectDB } from "./config";
import { envConstants } from "./constants";
import { setupInitialRolesAndPermissions, setupInitialUserRole } from "./script";
import { startServer } from "./server";

(async () => {
  try {
    await connectDB();
    if (!envConstants.INITIAL_SETUP_DONE) {
      await setupInitialRolesAndPermissions();
      await setupInitialUserRole();
    }
    await startServer(envConstants.APP_PORT);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to setup initial data:", error);
    process.exit(1);
  }
})();
