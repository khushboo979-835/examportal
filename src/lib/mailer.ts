import nodemailer from 'nodemailer';
import connectToDatabase from '@/lib/db';
import { Inquiry } from '@/models/Inquiry';

export interface InquiryEmailPayload {
  type: 'CONTACT_FORM' | 'INTERNSHIP_APPLICATION' | 'ORDER_PLACED' | 'GENERAL';
  studentName: string;
  studentEmail?: string;
  studentPhone?: string;
  subject?: string;
  message?: string;
  ticketId?: string;
  metadata?: Record<string, any>;
}

const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || 'studyfreepdf2@gmail.com';

/**
 * Returns a configured nodemailer transporter using environment variables.
 */
function getTransporter() {
  const user = process.env.SMTP_USER || process.env.GMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    return null;
  }

  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT || 465);
  const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    tls: {
      rejectUnauthorized: false, // Prevents self-signed cert blocks on custom proxies
    },
  });
}

/**
 * Sends a high-priority inquiry email to studyfreepdf2@gmail.com whenever any student fills a form.
 */
export async function sendInquiryEmail(payload: InquiryEmailPayload): Promise<{ success: boolean; emailSent: boolean; message: string }> {
  const {
    type,
    studentName,
    studentEmail = '',
    studentPhone = '',
    subject = 'New Student Inquiry',
    message = '',
    ticketId = `TKT-${Date.now().toString(36).toUpperCase()}`,
    metadata = {},
  } = payload;

  const typeLabels: Record<string, { title: string; color: string; badge: string }> = {
    CONTACT_FORM: { title: 'New Support Desk Inquiry', color: '#00A389', badge: 'Contact Form' },
    INTERNSHIP_APPLICATION: { title: 'New NEP-2020 Internship Application', color: '#1A73E8', badge: 'Internship Lead' },
    ORDER_PLACED: { title: 'New PDF / Pass Order Paid', color: '#F59E0B', badge: 'Order Payment' },
    GENERAL: { title: 'New Student Submission', color: '#6366F1', badge: 'General Inquiry' },
  };

  const currentType = typeLabels[type] || typeLabels.GENERAL;

  // Metadata rows if available
  const metaRows = Object.entries(metadata)
    .filter(([_, v]) => v !== undefined && v !== null && v !== '')
    .map(
      ([k, v]) => `
      <tr>
        <td style="padding: 8px 12px; font-weight: bold; color: #475569; border-bottom: 1px solid #E2E8F0; text-transform: capitalize;">${k.replace(/([A-Z])/g, ' $1')}:</td>
        <td style="padding: 8px 12px; color: #0F172A; border-bottom: 1px solid #E2E8F0;">${String(v)}</td>
      </tr>`
    )
    .join('');

  const cleanPhone = studentPhone.replace(/[^0-9]/g, '');
  const waLink = cleanPhone ? `https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}` : '';

  const htmlBody = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <title>${currentType.title}</title>
  </head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC; margin: 0; padding: 24px;">
    <div style="max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
      
      <!-- Top Header -->
      <div style="background: #0F172A; padding: 24px 28px; text-align: left; border-bottom: 3px solid ${currentType.color};">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h2 style="color: #ffffff; margin: 0; font-size: 18px; font-weight: 800; letter-spacing: -0.5px;">
            StudyFree <span style="color: #00A389;">PDF</span>
          </h2>
          <span style="background: ${currentType.color}; color: #ffffff; font-size: 10px; font-weight: 800; text-transform: uppercase; padding: 4px 10px; border-radius: 20px;">
            ${currentType.badge}
          </span>
        </div>
        <p style="color: #94A3B8; font-size: 11px; margin: 6px 0 0 0;">
          Digital Developer Infinity Solution (DDIS) • "Talent Aapka, Rasta Hamara"
        </p>
      </div>

      <!-- Main Content -->
      <div style="padding: 28px;">
        <h3 style="font-size: 16px; font-weight: 800; color: #0F172A; margin: 0 0 6px 0;">
          ${currentType.title}
        </h3>
        <p style="font-size: 12px; color: #64748B; margin: 0 0 20px 0;">
          A student has submitted a new inquiry on <strong>studyfreepdf.com</strong>. Details are provided below:
        </p>

        <!-- Details Table -->
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 24px; background: #F8FAFC; border-radius: 10px; overflow: hidden; border: 1px solid #E2E8F0;">
          <tbody>
            <tr>
              <td style="padding: 10px 12px; font-weight: bold; color: #475569; border-bottom: 1px solid #E2E8F0; width: 35%;">Reference Ticket:</td>
              <td style="padding: 10px 12px; font-family: monospace; font-weight: bold; color: #00A389; border-bottom: 1px solid #E2E8F0;">${ticketId}</td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; font-weight: bold; color: #475569; border-bottom: 1px solid #E2E8F0;">Student Name:</td>
              <td style="padding: 10px 12px; font-weight: bold; color: #0F172A; border-bottom: 1px solid #E2E8F0;">${studentName}</td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; font-weight: bold; color: #475569; border-bottom: 1px solid #E2E8F0;">WhatsApp / Phone:</td>
              <td style="padding: 10px 12px; color: #0F172A; border-bottom: 1px solid #E2E8F0;">
                <a href="tel:${studentPhone}" style="color: #1A73E8; text-decoration: none; font-weight: 600;">${studentPhone || 'Not provided'}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; font-weight: bold; color: #475569; border-bottom: 1px solid #E2E8F0;">Email Address:</td>
              <td style="padding: 10px 12px; color: #0F172A; border-bottom: 1px solid #E2E8F0;">
                <a href="mailto:${studentEmail}" style="color: #1A73E8; text-decoration: none;">${studentEmail || 'Not provided'}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; font-weight: bold; color: #475569; border-bottom: 1px solid #E2E8F0;">Subject / Topic:</td>
              <td style="padding: 10px 12px; color: #0F172A; border-bottom: 1px solid #E2E8F0;">${subject}</td>
            </tr>
            ${metaRows}
          </tbody>
        </table>

        <!-- Message Body -->
        ${
          message
            ? `
        <div style="margin-bottom: 24px;">
          <div style="font-size: 11px; font-weight: 800; color: #64748B; text-transform: uppercase; margin-bottom: 8px;">
            Message / Inquiry Details:
          </div>
          <div style="padding: 14px 16px; background: #FFFFFF; border-left: 4px solid ${currentType.color}; border: 1px solid #CBD5E1; border-left-width: 4px; border-radius: 8px; font-size: 13px; color: #1E293B; line-height: 1.6; white-space: pre-wrap;">
${message}
          </div>
        </div>`
            : ''
        }

        <!-- 1-Click Fast Actions -->
        <div style="padding-top: 10px; display: flex; gap: 12px;">
          ${
            waLink
              ? `
          <a href="${waLink}" target="_blank" style="display: inline-block; background: #25D366; color: #ffffff; padding: 10px 18px; border-radius: 8px; text-decoration: none; font-size: 12px; font-weight: bold; margin-right: 8px;">
            💬 Reply on WhatsApp
          </a>`
              : ''
          }
          ${
            studentEmail
              ? `
          <a href="mailto:${studentEmail}?subject=Re: StudyFree PDF Inquiry (${ticketId})" style="display: inline-block; background: #0F172A; color: #ffffff; padding: 10px 18px; border-radius: 8px; text-decoration: none; font-size: 12px; font-weight: bold;">
            ✉️ Reply via Email
          </a>`
              : ''
          }
        </div>

      </div>

      <!-- Footer -->
      <div style="background: #F1F5F9; padding: 16px 28px; text-align: center; border-top: 1px solid #E2E8F0; font-size: 11px; color: #64748B;">
        This automated notification was generated by the <strong>StudyFreePDF</strong> student dispatch system.<br />
        Delivered to official administrative inbox: <strong>${ADMIN_EMAIL}</strong>
      </div>

    </div>
  </body>
  </html>
  `;

  let emailSent = false;
  let dispatchNote = '';

  try {
    const transporter = getTransporter();

    if (transporter) {
      await transporter.sendMail({
        from: `"StudyFreePDF Inquiries" <${process.env.SMTP_USER || 'no-reply@studyfreepdf.com'}>`,
        to: ADMIN_EMAIL,
        replyTo: studentEmail || undefined,
        subject: `[${currentType.badge}] ${subject} - ${studentName}`,
        html: htmlBody,
      });
      emailSent = true;
      dispatchNote = `Direct email successfully delivered to ${ADMIN_EMAIL}`;
    } else {
      dispatchNote = `SMTP credentials not yet configured in .env. Logged inquiry to database & console.`;
    }
  } catch (err: any) {
    console.warn(`[MAILER WARNING] Could not send live email to ${ADMIN_EMAIL}:`, err.message);
    dispatchNote = `SMTP attempt logged: ${err.message}`;
  }

  // Always persist inquiry in MongoDB Atlas
  try {
    await connectToDatabase();
    await Inquiry.create({
      ticketId,
      name: studentName,
      email: studentEmail,
      phone: studentPhone,
      category: type,
      subject,
      message: message || `Form submission from ${type}`,
      status: 'NEW',
      emailSent,
      metadata: { ...metadata, dispatchNote, submittedAt: new Date().toISOString() },
    });
  } catch (dbErr: any) {
    console.warn('[INQUIRY DB WARNING] Failed to persist inquiry to MongoDB:', dbErr.message);
  }

  console.log(`[STUDENT INQUIRY LOGGED] Ticket: ${ticketId} | Student: ${studentName} (${studentPhone || studentEmail}) | Target: ${ADMIN_EMAIL} | Sent: ${emailSent}`);

  return {
    success: true,
    emailSent,
    message: emailSent
      ? `Inquiry email dispatched to ${ADMIN_EMAIL}`
      : `Inquiry registered successfully (Ticket: ${ticketId})`,
  };
}
