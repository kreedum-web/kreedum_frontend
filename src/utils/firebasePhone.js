/**
 * Phone OTP through Firebase. Firebase sends the SMS and checks the code;
 * we then give its ID token to our backend (POST /auth/phone/firebase),
 * which checks it and signs the customer in.
 *
 * The Firebase SDK is loaded only when someone uses phone sign-in, so other
 * pages stay small. The web config comes from the backend (GET /auth/options).
 */
let loaded = null; // Promise<{ auth, mod }>
let verifier = null;

function loadFirebase(config) {
  if (!loaded) {
    loaded = Promise.all([import("firebase/app"), import("firebase/auth")])
      .then(([appModule, mod]) => {
        const app = appModule.getApps()[0] || appModule.initializeApp(config);
        const auth = mod.getAuth(app);
        auth.languageCode = "en";
        return { auth, mod };
      })
      .catch((error) => {
        loaded = null;
        throw error;
      });
  }
  return loaded;
}

const MESSAGES = {
  "auth/invalid-phone-number": "Enter a valid 10-digit mobile number.",
  "auth/missing-phone-number": "Enter your mobile number.",
  "auth/too-many-requests": "Too many attempts from this device. Please try again later or use email.",
  "auth/quota-exceeded": "We can't send more SMS codes right now. Please use email or try again later.",
  "auth/captcha-check-failed": "The security check failed. Please reload the page and try again.",
  "auth/invalid-app-credential": "The security check failed. Please reload the page and try again.",
  "auth/invalid-verification-code": "Wrong code. Please check the SMS and try again.",
  "auth/code-expired": "This code has expired. Please ask for a new one.",
  "auth/session-expired": "This code has expired. Please ask for a new one.",
  "auth/network-request-failed": "No connection. Check your internet and try again.",
  "auth/operation-not-allowed": "Phone sign-in isn't switched on yet. Please use email for now.",
  "auth/billing-not-enabled": "Phone sign-in isn't switched on yet. Please use email for now.",
  "auth/unauthorized-domain": "Phone sign-in isn't allowed on this website address yet. Please use email for now.",
};

/** A Firebase error as a message the customer can act on. */
function friendly(error) {
  const message = MESSAGES[error?.code];
  if (!message) console.error("Firebase phone sign-in:", error?.code || error);
  return new Error(message || "Couldn't complete phone sign-in. Please try again or use email.");
}

/**
 * Send the OTP SMS. Returns Firebase's confirmation, which checks the code.
 * Includes Google's invisible "I'm not a robot" check, as Firebase requires.
 */
export async function sendFirebaseOtp(config, tenDigitPhone) {
  try {
    const { auth, mod } = await loadFirebase(config);

    // A fresh check each time (also for "send a new code").
    verifier?.clear?.();
    document.getElementById("kreedum-recaptcha")?.remove();
    const holder = document.createElement("div");
    holder.id = "kreedum-recaptcha";
    document.body.appendChild(holder);
    verifier = new mod.RecaptchaVerifier(auth, holder, { size: "invisible" });

    return await mod.signInWithPhoneNumber(auth, `+91${tenDigitPhone}`, verifier);
  } catch (error) {
    throw friendly(error);
  }
}

/** Check the code; returns the ID token for our backend. */
export async function confirmFirebaseOtp(confirmation, code) {
  try {
    const result = await confirmation.confirm(code);
    const idToken = await result.user.getIdToken();
    // Our backend keeps the customer signed in; Firebase doesn't need to.
    const { auth, mod } = await loaded;
    await mod.signOut(auth).catch(() => {});
    return idToken;
  } catch (error) {
    throw friendly(error);
  }
}
