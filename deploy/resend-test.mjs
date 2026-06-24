// Test Resend sending directly — bypasses the app + Turnstile so it isolates
// the key + domain-verification. Run ON THE SERVER (where the env lives):
//   RESEND_API_KEY=re_xxx CONTACT_FROM='Double Helix Pharma <no-reply@doublehelixpharma.co.uk>' \
//   CONTACT_TO=you@inbox.com node deploy/resend-test.mjs
import { Resend } from "resend";

const { RESEND_API_KEY, CONTACT_FROM, CONTACT_TO } = process.env;
if (!RESEND_API_KEY || !CONTACT_FROM || !CONTACT_TO) {
  console.error("Set RESEND_API_KEY, CONTACT_FROM and CONTACT_TO in the environment.");
  process.exit(1);
}

const { data, error } = await new Resend(RESEND_API_KEY).emails.send({
  from: CONTACT_FROM,
  to: CONTACT_TO,
  subject: "Resend test — Double Helix Pharma",
  text: "If you received this, sending from your domain works.",
});

if (error) {
  console.error("FAILED:", JSON.stringify(error));
  process.exit(1);
}
console.log(`SENT id=${data.id} — check the ${CONTACT_TO} inbox and Resend -> Emails for "delivered".`);
