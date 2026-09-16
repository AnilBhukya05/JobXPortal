export async function sendWelcomeEmail(to, name) {
  try {
    const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_PUBLIC_KEY,
        accessToken: process.env.EMAILJS_PRIVATE_KEY,
        template_params: {
          to_name: name,
          to_email: to,
          dashboard_link: `${process.env.CLIENT_URL}/profile`,
        },
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`EmailJS error ${res.status}: ${body}`);
    }
  } catch (err) {
    console.error("Welcome email failed to send:", err.message);
  }
}

export async function sendResetEmail(to, name, rawToken) {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${rawToken}`;

  try {
    const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_RESET_TEMPLATE_ID,
        user_id: process.env.EMAILJS_PUBLIC_KEY,
        accessToken: process.env.EMAILJS_PRIVATE_KEY,
        template_params: {
          link: resetUrl,
          email: to,
        },
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`EmailJS error ${res.status}: ${body}`);
    }
  } catch (err) {
    console.error("Password reset email failed to send:", err.message);
  }
}

export async function sendVerificationEmail(to, name, otp) {
  try {
    const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: process.env.EMAILJS_SERVICE_ID,

        // Reuse your existing Welcome template
        template_id: process.env.EMAILJS_TEMPLATE_ID,

        user_id: process.env.EMAILJS_PUBLIC_KEY,
        accessToken: process.env.EMAILJS_PRIVATE_KEY,

        template_params: {
          to_name: name,
          to_email: to,
          otp: otp,
        },
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`EmailJS error ${res.status}: ${body}`);
    }

    console.log(`Verification OTP sent to ${to}`);
  } catch (err) {
    console.error(
      "Verification email failed to send:",
      err.message
    );
  }
}