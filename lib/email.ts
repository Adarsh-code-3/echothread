import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

export async function sendOtpEmail(email: string, code: string, name?: string) {
  const greeting = name ? `Hi ${name},` : "Hi there,"

  const html = `
    <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <div style="display: inline-block; width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #FF6B6B, #FF9A56); margin-bottom: 16px;"></div>
        <h1 style="font-size: 24px; color: #1A1A2E; margin: 0;">EchoThread</h1>
      </div>
      <div style="background: #FFFBF5; border-radius: 16px; padding: 32px; border: 1px solid #FFF0E0;">
        <p style="color: #1A1A2E; font-size: 16px; margin-top: 0;">${greeting}</p>
        <p style="color: #6B7280; font-size: 14px;">Here is your verification code:</p>
        <div style="text-align: center; margin: 24px 0;">
          <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #1A1A2E; background: #FFF0E0; padding: 16px 32px; border-radius: 12px; display: inline-block;">${code}</span>
        </div>
        <p style="color: #6B7280; font-size: 13px; text-align: center;">This code expires in 10 minutes.</p>
      </div>
      <p style="color: #9CA3AF; font-size: 12px; text-align: center; margin-top: 24px;">
        If you did not request this code, you can safely ignore this email.
      </p>
    </div>
  `

  await transporter.sendMail({
    from: `"EchoThread" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: `${code} is your EchoThread verification code`,
    html,
  })
}
