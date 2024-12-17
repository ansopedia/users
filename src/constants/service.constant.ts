export enum ServiceEnum {
  USER_SERVICE = "user-service",
  NOTIFICATION_SERVICE = "notification-service",
  CMS_SERVICE = "cms-service",
  CHAT_SERVICE = "chat-service",
}

export const SERVICE_AUDIENCE = Object.values(ServiceEnum);

export const CURRENT_SERVICE = ServiceEnum.USER_SERVICE;
