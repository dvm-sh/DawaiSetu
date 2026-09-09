import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Use onboarding@resend.dev as the from address unless a custom domain is verified
const FROM_EMAIL = 'DawaiSetu Notifications <onboarding@miet.college>';

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY is not set. Skipping email send.');
    return { success: false, error: 'Resend API key missing' };
  }

  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}

export const emailTemplates = {
  organizationApproved: (orgName: string) => `
    <div style="font-family: sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #0d9488;">DawaiSetu Accreditation Approved</h2>
      <p>Dear ${orgName},</p>
      <p>We are pleased to inform you that your organization's document verification is complete, and your accreditation on DawaiSetu has been <strong>approved</strong>.</p>
      <p>You can now log in to your dashboard to access full platform capabilities, including inventory management and redistribution matching.</p>
      <br/>
      <p>Best regards,<br/>The DawaiSetu Compliance Team</p>
    </div>
  `,

  organizationRejected: (orgName: string, reason?: string) => `
    <div style="font-family: sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #dc2626;">DawaiSetu Accreditation Update</h2>
      <p>Dear ${orgName},</p>
      <p>We have reviewed your organization's registration on DawaiSetu. Unfortunately, we are unable to approve your application at this time.</p>
      ${reason ? `<p><strong>Reason provided:</strong> ${reason}</p>` : ''}
      <p>Please contact our support team if you believe this is an error or if you wish to provide updated compliance documentation.</p>
      <br/>
      <p>Best regards,<br/>The DawaiSetu Compliance Team</p>
    </div>
  `,

  organizationSuspended: (orgName: string) => `
    <div style="font-family: sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #ea580c;">DawaiSetu Account Suspended</h2>
      <p>Dear ${orgName},</p>
      <p>Your organization's account on DawaiSetu has been temporarily <strong>suspended</strong> pending a compliance review.</p>
      <p>During this time, your dashboard and operational capabilities are locked. Please contact administration immediately to resolve this matter.</p>
      <br/>
      <p>Best regards,<br/>The DawaiSetu Compliance Team</p>
    </div>
  `,

  organizationUnSuspended: (orgName: string) => `
    <div style="font-family: sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #0d9488;">DawaiSetu Account Restored</h2>
      <p>Dear ${orgName},</p>
      <p>Your organization's account on DawaiSetu has been <strong>reinstated</strong> following a successful review.</p>
      <p>Your dashboard access and operational capabilities have been fully restored. Thank you for your cooperation.</p>
      <br/>
      <p>Best regards,<br/>The DawaiSetu Compliance Team</p>
    </div>
  `
};
