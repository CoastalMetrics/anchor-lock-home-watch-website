import {setGlobalOptions} from "firebase-functions";
import {onCall, HttpsError} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

admin.initializeApp();

setGlobalOptions({maxInstances: 10});

export const createCustomer = onCall(async (request) => {
  // Must be authenticated
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Must be authenticated.");
  }

  const callerEmail = request.auth.token.email;
  if (!callerEmail) {
    throw new HttpsError(
      "unauthenticated",
      "Caller must have an email."
    );
  }

  // Must be an admin
  const adminDoc = await admin
    .firestore()
    .doc(`admins/${callerEmail}`)
    .get();
  if (!adminDoc.exists) {
    throw new HttpsError(
      "permission-denied",
      "Only admins can create customers."
    );
  }

  const {name, email, phone} = request.data as {
    name: string;
    email: string;
    phone?: string;
  };

  if (!name || !email) {
    throw new HttpsError(
      "invalid-argument",
      "name and email are required."
    );
  }

  // Create Firebase Auth account
  let uid: string;
  try {
    const userRecord = await admin
      .auth()
      .createUser({email, displayName: name});
    uid = userRecord.uid;
  } catch (err: unknown) {
    const code = (err as {code?: string}).code;
    if (code === "auth/email-already-exists") {
      throw new HttpsError(
        "already-exists",
        "A customer with this email already exists."
      );
    }
    logger.error("createUser failed", err);
    throw new HttpsError("internal", "Failed to create auth account.");
  }

  // Create Firestore document — if this fails, clean up the Auth account
  try {
    await admin.firestore().doc(`users/${uid}`).set({
      name,
      email,
      phone: phone ?? null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: callerEmail,
    });
  } catch (err) {
    logger.error(
      "Firestore write failed, deleting orphaned auth account",
      {uid, err}
    );
    await admin.auth().deleteUser(uid).catch(() => null);
    throw new HttpsError(
      "internal",
      "Failed to save customer. Please try again."
    );
  }

  logger.info(`Customer created: ${email} uid=${uid}`);

  // After this returns, the admin portal calls sendSignInLinkToEmail
  // to send the welcome magic link via Firebase's built-in email service.
  return {success: true, uid};
});
