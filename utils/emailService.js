// utils/emailService.js
const SibApiV3Sdk = require('sib-api-v3-sdk');

const sendEmail = async (data) => {
  const defaultClient = SibApiV3Sdk.ApiClient.instance;
  const apiKey = defaultClient.authentications['api-key'];
  apiKey.apiKey = process.env.EMAIL_API_KEY;

  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  // Base URL del servidor para las imágenes
  const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000';

  // Definir info del evento con sus logos
  const EVENT_INFO = {
    mangrove: {
      name: 'The Mangrove',
      logo: `https://i.imgur.com/tfGWE9O.jpg`  // Agregado "i." y ".jpg"
    },
    ikigai: {
      name: 'Ikigai',
      logo: `https://i.imgur.com/HPlnHCL.jpg`  // Agregado "i." y ".jpg"
    }
  };

  const currentEvent = EVENT_INFO[data.eventType] || EVENT_INFO.mangrove;
  const eventName = currentEvent.name;
  const eventLogo = currentEvent.logo;

  const sendSmtpEmail = {
    to: [{ email: data.email, name: `${data.firstName} ${data.lastName}` }],
    sender: { email: 'events@biras.com', name: 'Biras Creek Resort' },
    subject: `Your Reservation is Confirmed — ${eventName} New Year 2026`,
    htmlContent: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Montserrat', -apple-system, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; max-width: 600px;">
                  
                  <!-- Header con Logo del Evento -->
                  <tr>
                    <td style="padding: 50px 50px 30px 50px; text-align: center; background-color: #0a1929; border-bottom: 1px solid #c9a55a;">
                      <img src="${eventLogo}" alt="${eventName}" style="max-width: 400px; width: 100%; height: auto; margin-bottom: 24px; display: block; margin-left: auto; margin-right: auto;" />
                      <p style="color: #c9a55a; font-size: 14px; font-weight: 500; margin: 10px 0 0 0; letter-spacing: 1px;">NEW YEAR'S EVE 2026</p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 40px 50px 30px 50px;">
                      <div style="text-align: center; padding: 20px; background-color: #f8f9fa; border-left: 3px solid #c9a55a;">
                        <p style="margin: 0; color: #c9a55a; font-size: 13px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;">Reservation Confirmed</p>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 0 50px 30px 50px;">
                      <p style="color: #0a1929; font-size: 15px; line-height: 1.8; font-weight: 300; margin: 0;">Dear ${data.firstName} ${data.lastName},</p>
                      <p style="color: #5a6c7d; font-size: 15px; line-height: 1.8; font-weight: 300; margin: 20px 0 0 0;">Thank you for your reservation. We are delighted to confirm your tickets for our exclusive New Year's celebration at ${eventName}, Biras Creek Resort.</p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 0 50px 30px 50px;">
                      <table width="100%" cellpadding="0" cellspacing="0" style="border-top: 1px solid #e0e0e0;">
                        <tr>
                          <td style="padding: 15px 0; border-bottom: 1px solid #f0f0f0;"><span style="color: #7a8a9a; font-size: 13px;">Reservation ID</span></td>
                          <td style="padding: 15px 0; border-bottom: 1px solid #f0f0f0; text-align: right;"><span style="color: #0a1929; font-size: 13px; font-family: monospace;">${data.ticketId}</span></td>
                        </tr>
                        <tr>
                          <td style="padding: 15px 0; border-bottom: 1px solid #f0f0f0;"><span style="color: #7a8a9a; font-size: 13px;">Event</span></td>
                          <td style="padding: 15px 0; border-bottom: 1px solid #f0f0f0; text-align: right;"><span style="color: #0a1929; font-size: 13px; font-weight: 500;">${eventName}</span></td>
                        </tr>
                        <tr>
                          <td style="padding: 15px 0; border-bottom: 1px solid #f0f0f0;"><span style="color: #7a8a9a; font-size: 13px;">Guest Name</span></td>
                          <td style="padding: 15px 0; border-bottom: 1px solid #f0f0f0; text-align: right;"><span style="color: #0a1929; font-size: 13px;">${data.firstName} ${data.lastName}</span></td>
                        </tr>
                        <tr>
                          <td style="padding: 15px 0; border-bottom: 1px solid #f0f0f0;"><span style="color: #7a8a9a; font-size: 13px;">Number of Guests</span></td>
                          <td style="padding: 15px 0; border-bottom: 1px solid #f0f0f0; text-align: right;"><span style="color: #0a1929; font-size: 13px;">${data.guests}</span></td>
                        </tr>
                        <tr>
                          <td style="padding: 15px 0; border-bottom: 1px solid #f0f0f0;"><span style="color: #7a8a9a; font-size: 13px;">Price per Ticket</span></td>
                          <td style="padding: 15px 0; border-bottom: 1px solid #f0f0f0; text-align: right;"><span style="color: #0a1929; font-size: 13px;">$${data.ticketPrice.toFixed(2)} USD</span></td>
                        </tr>
                        <tr>
                          <td style="padding: 15px 0; border-bottom: 1px solid #f0f0f0;"><span style="color: #7a8a9a; font-size: 13px;">Total Amount</span></td>
                          <td style="padding: 15px 0; border-bottom: 1px solid #f0f0f0; text-align: right;"><span style="color: #c9a55a; font-size: 16px; font-weight: 600;">$${data.totalAmount.toFixed(2)} USD</span></td>
                        </tr>
                        <tr>
                          <td style="padding: 15px 0;"><span style="color: #7a8a9a; font-size: 13px;">Authorization Number</span></td>
                          <td style="padding: 15px 0; text-align: right;"><span style="color: #0a1929; font-size: 13px; font-family: monospace;">${data.paymentNumber}</span></td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 0 50px 30px 50px;">
                      <div style="background: #f8f9fa; padding: 25px; border-left: 3px solid #c9a55a;">
                        <p style="margin: 0 0 15px 0; color: #0a1929; font-size: 14px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;">Event Details</p>
                        <p style="margin: 8px 0; color: #5a6c7d; font-size: 14px;">📅 Date: <span style="color: #0a1929;">December 31, 2025</span></p>
                        <p style="margin: 8px 0; color: #5a6c7d; font-size: 14px;">🕘 Time: <span style="color: #0a1929;">9:00 PM — 2:00 AM</span></p>
                        <p style="margin: 8px 0; color: #5a6c7d; font-size: 14px;">📍 Location: <span style="color: #0a1929;">${eventName} Restaurant</span></p>
                        <p style="margin: 8px 0 0 25px; color: #7a8a9a; font-size: 13px;">Biras Creek Resort, North Sound, Virgin Gorda, BVI</p>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 0 50px 40px 50px;">
                      <p style="color: #5a6c7d; font-size: 14px; line-height: 1.8; margin: 0;">Please present this confirmation upon arrival. Should you have any questions, feel free to contact us at <a href="mailto:events@biras.com" style="color: #c9a55a; text-decoration: none;">events@biras.com</a>.</p>
                      <p style="color: #5a6c7d; font-size: 14px; line-height: 1.8; margin: 25px 0 0 0;">We look forward to welcoming you to an unforgettable celebration.</p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 30px 50px; background-color: #f8f9fa; text-align: center; border-top: 1px solid #e0e0e0;">
                      <p style="color: #5a6c7d; font-size: 12px; margin: 0; letter-spacing: 1px; font-weight: 500;">BIRAS CREEK RESORT</p>
                      <p style="color: #7a8a9a; font-size: 11px; margin: 8px 0 0 0;">North Sound, Virgin Gorda, British Virgin Islands</p>
                      <p style="color: #7a8a9a; font-size: 11px; margin: 15px 0 0 0;">Accessible only by boat or helicopter</p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `
  };

  try {
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Email enviado:', result.messageId);
    return result;
  } catch (error) {
    console.error('❌ Error al enviar email:', error.response?.body || error);
    throw error;
  }
};

module.exports = sendEmail;