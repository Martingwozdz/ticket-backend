// utils/omakaseEmailService.js
const SibApiV3Sdk = require('sib-api-v3-sdk');

const sendOmakaseEmails = async (data) => {
  const defaultClient = SibApiV3Sdk.ApiClient.instance;
  const apiKey = defaultClient.authentications['api-key'];
  apiKey.apiKey = process.env.EMAIL_API_KEY;

  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  // Formatear fecha para display
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', options);
  };

  // EMAIL AL CLIENTE (Estilo Biras Marina)
  const clientEmail = {
    to: [{ email: data.email, name: `${data.firstName} ${data.lastName}` }],
    sender: { email: 'reservations@biras.com', name: 'Ikigai Omakase at Biras Creek' },
    subject: 'Reservation Confirmed — Ikigai Omakase Experience',
    htmlContent: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        </head>
        <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #f5f3ef 0%, #e8e5df 100%); font-family: 'Inter', -apple-system, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f5f3ef 0%, #e8e5df 100%); padding: 50px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(145deg, #ffffff 0%, #fafaf8 100%); max-width: 600px; border-radius: 20px; box-shadow: 0 30px 80px rgba(0, 0, 0, 0.12); overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.8);">
                  
                  <!-- HEADER CON LOGO -->
                  <tr>
                    <td style="padding: 50px 50px 40px 50px; text-align: center; background: linear-gradient(145deg, #ffffff 0%, #fafaf8 100%); position: relative;">
                      <!-- Logo de Biras en fondo blanco -->
                      <div style="display: inline-block; background: #ffffff; padding: 25px 35px; border-radius: 12px; margin-bottom: 30px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08); border: 1px solid rgba(232, 229, 223, 0.5);">
                        <img src="https://i.imgur.com/bla1SSw.png" alt="Biras Creek Resort" style="width: 180px; height: auto; display: block;" />
                      </div>
                      
                      <p style="font-size: 11px; color: #b8956a; font-weight: 600; letter-spacing: 2.5px; margin: 0 0 8px 0; text-transform: uppercase; font-family: 'Inter', sans-serif;">OMAKASE EXPERIENCE</p>
                      
                      <h1 style="font-size: 56px; font-weight: 500; color: #2c2c2c; margin: 0; letter-spacing: 0px; font-family: 'Cormorant Garamond', serif; line-height: 1.1;">Omakase</h1>
                      
                      <p style="font-size: 24px; color: #b8956a; font-weight: 300; letter-spacing: 3px; margin: 8px 0 20px 0; font-family: 'Cormorant Garamond', serif;">生き甲斐</p>
                      
                      <p style="font-size: 15px; color: #6b6b6b; font-weight: 400; line-height: 1.5; margin: 0 auto; max-width: 500px; font-family: 'Inter', sans-serif;">An intimate 12-seat omakase bar featuring the finest Japanese-Caribbean fusion cuisine</p>
                    </td>
                  </tr>

                  <!-- SEPARADOR SUTIL -->
                  <tr>
                    <td style="padding: 0 50px;">
                      <div style="height: 1px; background: linear-gradient(90deg, transparent 0%, rgba(184, 149, 106, 0.2) 50%, transparent 100%);"></div>
                    </td>
                  </tr>

                  <!-- CONFIRMACIÓN -->
                  <tr>
                    <td style="padding: 40px 50px 30px 50px; background: linear-gradient(145deg, #ffffff 0%, #fafaf8 100%);">
                      <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, rgba(184, 149, 106, 0.08) 0%, rgba(184, 149, 106, 0.04) 100%); border-radius: 10px; border: 1px solid rgba(184, 149, 106, 0.15);">
                        <p style="margin: 0; color: #b8956a; font-size: 12px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; font-family: 'Inter', sans-serif;">✓ Reservation Confirmed</p>
                      </div>
                    </td>
                  </tr>

                  <!-- SALUDO -->
                  <tr>
                    <td style="padding: 0 50px 30px 50px; background: linear-gradient(145deg, #ffffff 0%, #fafaf8 100%);">
                      <p style="color: #2c2c2c; font-size: 16px; line-height: 1.8; font-weight: 400; margin: 0; font-family: 'Inter', sans-serif;">Dear ${data.firstName} ${data.lastName},</p>
                      <p style="color: #6b6b6b; font-size: 15px; line-height: 1.8; font-weight: 400; margin: 20px 0 0 0; font-family: 'Inter', sans-serif;">
                        Thank you for your reservation. We are delighted to confirm your Omakase experience at Ikigai, Biras Creek Resort.
                      </p>
                    </td>
                  </tr>

                  <!-- DETALLES DE RESERVA -->
                  <tr>
                    <td style="padding: 0 50px 30px 50px; background: linear-gradient(145deg, #ffffff 0%, #fafaf8 100%);">
                      <table width="100%" cellpadding="0" cellspacing="0" style="background: #fafaf8; border-radius: 10px; overflow: hidden; border: 1px solid rgba(213, 208, 199, 0.3);">
                        <tr>
                          <td style="padding: 18px 25px; border-bottom: 1px solid rgba(213, 208, 199, 0.3);">
                            <span style="color: #6b6b6b; font-size: 13px; font-family: 'Inter', sans-serif;">Reservation ID</span>
                          </td>
                          <td style="padding: 18px 25px; border-bottom: 1px solid rgba(213, 208, 199, 0.3); text-align: right;">
                            <span style="color: #2c2c2c; font-size: 13px; font-family: 'Courier New', monospace; background: rgba(184, 149, 106, 0.1); padding: 4px 8px; border-radius: 4px;">${data.reservationId}</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 18px 25px; border-bottom: 1px solid rgba(213, 208, 199, 0.3);">
                            <span style="color: #6b6b6b; font-size: 13px; font-family: 'Inter', sans-serif;">📅 Date</span>
                          </td>
                          <td style="padding: 18px 25px; border-bottom: 1px solid rgba(213, 208, 199, 0.3); text-align: right;">
                            <span style="color: #2c2c2c; font-size: 14px; font-weight: 600; font-family: 'Inter', sans-serif;">${formatDate(data.reservationDate)}</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 18px 25px; border-bottom: 1px solid rgba(213, 208, 199, 0.3);">
                            <span style="color: #6b6b6b; font-size: 13px; font-family: 'Inter', sans-serif;">⏰ Time</span>
                          </td>
                          <td style="padding: 18px 25px; border-bottom: 1px solid rgba(213, 208, 199, 0.3); text-align: right;">
                            <span style="color: #2c2c2c; font-size: 14px; font-weight: 500; font-family: 'Inter', sans-serif;">${data.reservation_time || '7:30 PM'}</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 18px 25px; border-bottom: 1px solid rgba(213, 208, 199, 0.3);">
                            <span style="color: #6b6b6b; font-size: 13px; font-family: 'Inter', sans-serif;">👥 Guests</span>
                          </td>
                          <td style="padding: 18px 25px; border-bottom: 1px solid rgba(213, 208, 199, 0.3); text-align: right;">
                            <span style="color: #2c2c2c; font-size: 14px; font-family: 'Inter', sans-serif;">${data.guests} ${data.guests === 1 ? 'Guest' : 'Guests'}</span>
                          </td>
                        </tr>
                        ${data.allergies ? `
                        <tr style="background: linear-gradient(135deg, #fff5f5 0%, #fee 100%);">
                          <td style="padding: 18px 25px; border-bottom: 1px solid rgba(213, 208, 199, 0.3);">
                            <span style="color: #c53030; font-size: 13px; font-weight: 600; font-family: 'Inter', sans-serif;">⚠️ Allergies</span>
                          </td>
                          <td style="padding: 18px 25px; border-bottom: 1px solid rgba(213, 208, 199, 0.3); text-align: right;">
                            <span style="color: #c53030; font-size: 13px; font-weight: 500; font-family: 'Inter', sans-serif;">${data.allergies}</span>
                          </td>
                        </tr>
                        ` : ''}
                        ${data.specialRequests ? `
                        <tr>
                          <td style="padding: 18px 25px; border-bottom: 1px solid rgba(213, 208, 199, 0.3);">
                            <span style="color: #6b6b6b; font-size: 13px; font-family: 'Inter', sans-serif;">💬 Special Requests</span>
                          </td>
                          <td style="padding: 18px 25px; border-bottom: 1px solid rgba(213, 208, 199, 0.3); text-align: right;">
                            <span style="color: #2c2c2c; font-size: 13px; font-family: 'Inter', sans-serif;">${data.specialRequests}</span>
                          </td>
                        </tr>
                        ` : ''}
                        <tr>
                          <td style="padding: 20px 25px;">
                            <span style="color: #6b6b6b; font-size: 14px; font-weight: 500; font-family: 'Inter', sans-serif;">Total Amount</span>
                          </td>
                          <td style="padding: 20px 25px; text-align: right;">
                            <span style="color: #b8956a; font-size: 24px; font-weight: 600; font-family: 'Inter', sans-serif;">$${data.totalAmount.toFixed(2)}</span>
                            <span style="color: #999; font-size: 14px; font-family: 'Inter', sans-serif;"> USD</span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- INFORMACIÓN IMPORTANTE -->
                  <tr>
                    <td style="padding: 0 50px 30px 50px; background: linear-gradient(145deg, #ffffff 0%, #fafaf8 100%);">
                      <div style="background: linear-gradient(135deg, rgba(184, 149, 106, 0.08) 0%, rgba(184, 149, 106, 0.04) 100%); padding: 25px; border-radius: 10px; border: 1px solid rgba(184, 149, 106, 0.2);">
                        <p style="margin: 0 0 15px 0; color: #b8956a; font-size: 12px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; font-family: 'Inter', sans-serif;">Important Information</p>
                        <ul style="margin: 0; padding-left: 20px; color: #6b6b6b; font-size: 14px; line-height: 2; font-family: 'Inter', sans-serif;">
                          <li><strong style="color: #2c2c2c;">Dress Code:</strong> Elegant attire required</li>
                          <li>Please arrive <strong style="color: #2c2c2c;">10 minutes</strong> before your reservation</li>
                          <li>Experience duration: approximately <strong style="color: #2c2c2c;">2 hours</strong></li>
                          <li>For changes, contact us at least <strong style="color: #2c2c2c;">24 hours</strong> in advance</li>
                        </ul>
                      </div>
                    </td>
                  </tr>

                  <!-- LOCATION -->
                  <tr>
                    <td style="padding: 0 50px 30px 50px; background: linear-gradient(145deg, #ffffff 0%, #fafaf8 100%);">
                      <div style="background: #fafaf8; padding: 20px; border-radius: 10px; border-left: 3px solid #b8956a;">
                        <p style="margin: 0 0 10px 0; color: #2c2c2c; font-size: 14px; font-weight: 600; font-family: 'Inter', sans-serif;">📍 Location</p>
                        <p style="margin: 0; color: #6b6b6b; font-size: 14px; font-family: 'Inter', sans-serif;">Ikigai at Biras Creek Resort</p>
                        <p style="margin: 5px 0 0 0; color: #999; font-size: 13px; font-family: 'Inter', sans-serif;">North Sound, Virgin Gorda, British Virgin Islands</p>
                        <p style="margin: 10px 0 0 0; color: #b8956a; font-size: 12px; font-style: italic; font-family: 'Inter', sans-serif;">Accessible by boat or helicopter only</p>
                      </div>
                    </td>
                  </tr>

                  <!-- MENSAJE FINAL -->
                  <tr>
                    <td style="padding: 0 50px 40px 50px; background: linear-gradient(145deg, #ffffff 0%, #fafaf8 100%);">
                      <p style="color: #6b6b6b; font-size: 14px; line-height: 1.8; margin: 0; font-family: 'Inter', sans-serif;">
                        Should you have any questions, please contact us at <a href="mailto:ikigai@biras.com" style="color: #b8956a; text-decoration: none; font-weight: 500;">ikigai@biras.com</a>
                      </p>
                      <p style="color: #6b6b6b; font-size: 14px; line-height: 1.8; margin: 25px 0 0 0; font-family: 'Inter', sans-serif;">
                        We look forward to providing you with an unforgettable omakase experience.
                      </p>
                      <p style="color: #2c2c2c; font-size: 14px; margin: 30px 0 0 0; font-family: 'Inter', sans-serif;">
                        Best regards,<br>
                        <strong style="color: #b8956a;">The Ikigai Team</strong><br>
                        <span style="color: #999; font-size: 13px;">Biras Creek Resort</span>
                      </p>
                    </td>
                  </tr>

                  <!-- FOOTER -->
                  <tr>
                    <td style="padding: 30px 50px; background: linear-gradient(135deg, #f5f3ef 0%, #e8e5df 100%); text-align: center; border-top: 1px solid rgba(184, 149, 106, 0.2);">
                      <p style="color: #b8956a; font-size: 11px; margin: 0 0 8px 0; letter-spacing: 2px; font-weight: 600; text-transform: uppercase; font-family: 'Inter', sans-serif;">IKIGAI OMAKASE</p>
                      <p style="color: #999; font-size: 11px; margin: 0; font-family: 'Inter', sans-serif;">Biras Creek Resort • Virgin Gorda • British Virgin Islands</p>
                      <p style="color: #999; font-size: 10px; margin: 15px 0 0 0; font-family: 'Inter', sans-serif;">
                        Authorization #: <span style="font-family: 'Courier New', monospace;">${data.paymentNumber}</span>
                      </p>
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

  // EMAIL AL RESTAURANTE (más funcional)
  const restaurantEmail = {
    to: [{ email: process.env.RESTAURANT_EMAIL || 'ikigai@biras.com', name: 'Ikigai Staff' }],
    sender: { email: 'reservations@biras.com', name: 'Reservation System' },
    subject: `🍣 New Omakase — ${formatDate(data.reservationDate)} @ ${data.reservation_time || '7:30 PM'} — ${data.guests} Guests`,
    htmlContent: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f5f3ef; font-family: 'Inter', sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f3ef; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; max-width: 600px; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);">
                  
                  <tr>
                    <td style="padding: 30px; background: linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%); text-align: center;">
                      <h1 style="color: #b8956a; margin: 0; font-size: 24px; font-weight: 600;">🍣 New Omakase Reservation</h1>
                      <p style="color: #fff; margin: 8px 0 0 0; font-size: 14px; opacity: 0.9;">${formatDate(data.reservationDate)} @ ${data.reservation_time || '7:30 PM'}</p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 30px;">
                      <h2 style="color: #2c2c2c; margin: 0 0 20px 0; font-size: 18px; font-weight: 600;">Reservation Details</h2>
                      
                      <table width="100%" cellpadding="12" cellspacing="0" style="border: 1px solid #e8e5df; border-radius: 8px; overflow: hidden;">
                        <tr style="background-color: #fafaf8;">
                          <td style="padding: 15px; font-weight: 600; border-bottom: 1px solid #e8e5df; color: #6b6b6b; font-size: 13px;">Reservation ID</td>
                          <td style="padding: 15px; border-bottom: 1px solid #e8e5df; font-family: 'Courier New', monospace; font-size: 13px; text-align: right;">${data.reservationId}</td>
                        </tr>
                        <tr>
                          <td style="padding: 15px; font-weight: 600; border-bottom: 1px solid #e8e5df; color: #6b6b6b; font-size: 13px;">Date & Time</td>
                          <td style="padding: 15px; border-bottom: 1px solid #e8e5df; font-size: 14px; font-weight: 600; color: #2c2c2c; text-align: right;">${formatDate(data.reservationDate)}<br><span style="color: #b8956a;">${data.reservation_time || '7:30 PM'}</span></td>
                        </tr>
                        <tr style="background-color: #fafaf8;">
                          <td style="padding: 15px; font-weight: 600; border-bottom: 1px solid #e8e5df; color: #6b6b6b; font-size: 13px;">Guest Name</td>
                          <td style="padding: 15px; border-bottom: 1px solid #e8e5df; font-size: 14px; text-align: right;">${data.firstName} ${data.lastName}</td>
                        </tr>
                        <tr>
                          <td style="padding: 15px; font-weight: 600; border-bottom: 1px solid #e8e5df; color: #6b6b6b; font-size: 13px;">Contact</td>
                          <td style="padding: 15px; border-bottom: 1px solid #e8e5df; font-size: 13px; text-align: right;">
                            <a href="mailto:${data.email}" style="color: #b8956a; text-decoration: none;">${data.email}</a><br>
                            <span style="color: #6b6b6b;">${data.phone}</span>
                          </td>
                        </tr>
                        <tr style="background-color: #fafaf8;">
                          <td style="padding: 15px; font-weight: 600; border-bottom: 1px solid #e8e5df; color: #6b6b6b; font-size: 13px;">Guests</td>
                          <td style="padding: 15px; border-bottom: 1px solid #e8e5df; text-align: right;"><strong style="color: #b8956a; font-size: 20px;">${data.guests}</strong></td>
                        </tr>
                        ${data.allergies ? `
                        <tr style="background: linear-gradient(135deg, #fff5f5 0%, #fee 100%);">
                          <td style="padding: 15px; font-weight: 600; border-bottom: 1px solid #e8e5df; color: #c53030; font-size: 13px;">⚠️ ALLERGIES</td>
                          <td style="padding: 15px; border-bottom: 1px solid #e8e5df; color: #c53030; font-weight: 600; font-size: 13px; text-align: right;">${data.allergies}</td>
                        </tr>
                        ` : ''}
                        ${data.specialRequests ? `
                        <tr style="background-color: #fafaf8;">
                          <td style="padding: 15px; font-weight: 600; border-bottom: 1px solid #e8e5df; color: #6b6b6b; font-size: 13px;">Special Requests</td>
                          <td style="padding: 15px; border-bottom: 1px solid #e8e5df; font-size: 13px; text-align: right;">${data.specialRequests}</td>
                        </tr>
                        ` : ''}
                        <tr>
                          <td style="padding: 15px; font-weight: 600; color: #6b6b6b; font-size: 13px;">Total Amount</td>
                          <td style="padding: 15px; text-align: right;"><strong style="color: #b8956a; font-size: 18px;">$${data.totalAmount.toFixed(2)} USD</strong></td>
                        </tr>
                      </table>

                      <div style="margin-top: 25px; padding: 20px; background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%); border-left: 4px solid #28a745; border-radius: 8px;">
                        <p style="margin: 0; color: #155724; font-weight: 600; font-size: 14px;">✅ Payment Confirmed</p>
                        <p style="margin: 8px 0 0 0; color: #155724; font-size: 13px;">Authorization: <span style="font-family: 'Courier New', monospace;">${data.paymentNumber}</span></p>
                      </div>
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

  // Enviar ambos emails
  try {
    await apiInstance.sendTransacEmail(clientEmail);
    console.log('✅ Client email sent to:', data.email);
    
    await apiInstance.sendTransacEmail(restaurantEmail);
    console.log('✅ Restaurant notification sent');
    
    return true;
  } catch (error) {
    console.error('❌ Error sending emails:', error.response?.body || error);
    throw error;
  }
};

module.exports = sendOmakaseEmails;