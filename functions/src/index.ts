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

  const {name, email, phone, firstProperty} = request.data as {
    name: string;
    email: string;
    phone?: string;
    firstProperty?: {
      street: string;
      city: string;
      state: string;
      zip: string;
      nickname?: string;
    };
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

  // Create user doc + optional first property atomically
  try {
    const db = admin.firestore();
    const batch = db.batch();

    batch.set(db.doc(`users/${uid}`), {
      name,
      email,
      phone: phone ?? null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: callerEmail,
    });

    let propertyId: string | null = null;
    if (firstProperty?.street) {
      const propRef = db.collection(`users/${uid}/properties`).doc();
      propertyId = propRef.id;
      batch.set(propRef, {
        street: firstProperty.street,
        city: firstProperty.city,
        state: firstProperty.state,
        zip: firstProperty.zip,
        nickname: firstProperty.nickname ?? null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    await batch.commit();

    logger.info(`Customer created: ${email} uid=${uid}`);
    return {success: true, uid, propertyId};
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
});
