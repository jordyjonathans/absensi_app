import { eq } from "drizzle-orm";
import { MulticastMessage } from "firebase-admin/lib/messaging/messaging-api";
import { fcmTokensTable, rolesTable, usersTable } from "src/db/mysql";
import { MysqlConnection } from "src/db/mysql/mysqlConnection";
import admin from "src/lib/firebase/firebase";

interface NotificationPayload {
  title: string;
  body: string;
}

const sendMultiplePushNotification = async (
  tokens: string[],
  title: string,
  body: string
) => {
  const message: MulticastMessage = {
    notification: {
      title,
      body,
    },
    tokens,
  };

  try {
    const response = await admin.messaging().sendEachForMulticast(message);
    console.log(`Successfully sent: ${response.successCount}`);

    if (response.failureCount > 0) {
      const failedTokens: string[] = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push(tokens[idx]);
        }
      });
      console.warn("Failed tokens:", failedTokens);
    }

    return response;
  } catch (error) {
    console.error("Error sending multicast:", error);
    throw error;
  }
};

export const sendPushNotificationToAdmins = async (
  body: string,
  data?: Record<string, string>
) => {
  try {
    const db = MysqlConnection.getDbInstance();
    const tokens = await db
      .select({
        fcmToken: fcmTokensTable.fcmToken,
      })
      .from(fcmTokensTable)
      .innerJoin(usersTable, eq(fcmTokensTable.userId, usersTable.id))
      .innerJoin(rolesTable, eq(usersTable.roleId, rolesTable.id))
      .where(eq(rolesTable.roleSlug, "admin"));

    if (tokens.length === 0) {
      console.log("No admin users found.");
      return;
    }

    const fcmTokenList = tokens.map((t) => t.fcmToken).filter(Boolean);

    //Send notification

    const response = await sendMultiplePushNotification(
      fcmTokenList,
      "Notification",
      body
    );

    if (response.failureCount > 0) {
      console.error(
        "Some tokens failed:",
        response.responses.filter((r) => !r.success)
      );
    }
  } catch (e) {
    console.error("Failure push notif:", e);
  }
};
