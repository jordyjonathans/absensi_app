import admin from "firebase-admin";
import path from "path";

// Load service account key
const serviceAccount = require(path.resolve(
  __dirname,
  "../../firebase-service-account.json"
));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

console.log("✅ Firebase Admin Initialized");

export default admin;
