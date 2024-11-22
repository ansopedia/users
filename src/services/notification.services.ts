import { envConstants } from "@/constants";
import { logger } from "@/utils";

import { EmailNotification } from "./notification.validation";

const sendEmail = async (body: EmailNotification) => {
  try {
    await fetch(`${envConstants.NOTIFICATION_SERVICE_BASE_URL}/api/v1/emails`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        origin: envConstants.USER_SERVICE_BASE_URL,
      },
    });
  } catch (error) {
    logger.error(`Error while sending email, ${error}`);
  }
};

export const notificationService = {
  sendEmail,
};
