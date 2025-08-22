import admin from "./firebase";

interface NotificationPayload {
  title: string;
  body: string;
}

export async function sendPushNotification(
  deviceToken: string,
  payload: NotificationPayload,
  data?: Record<string, string>
) {
  const message: admin.messaging.Message = {
    token: deviceToken,
    notification: {
      title: payload.title,
      body: payload.body,
    },
    data: data || {}, // Optional custom data
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("📤 Notification sent successfully:", response);
    return response;
  } catch (error) {
    console.error("❌ Error sending notification:", error);
    throw error;
  }
}
