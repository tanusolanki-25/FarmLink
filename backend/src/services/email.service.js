import { BrevoClient } from "@getbrevo/brevo";
import { ApiError } from "../utils/apiError.js";

export const client = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

export const sendEmail = async (to, subject, text, html) => {
  try {
    const response = await client.transactionalEmails.sendTransacEmail({
      sender: {
        name: "FarmLink",
        email: process.env.BREVO_SENDER_EMAIL,
      },
      to: [{ email: to }],
      subject,
      textContent: text,
      htmlContent: html,
    });

    console.log("Message sent:", response.messageId);
  } catch (error) {
    console.error("EMAIL SEND ERROR:", error);
    throw new ApiError(500, "Unable to send verification email");
  }
};