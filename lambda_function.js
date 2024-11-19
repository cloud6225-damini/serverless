const sendgridMail = require('@sendgrid/mail');
sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.handler = async (event) => {
  try {
    const message = JSON.parse(event.Records[0].Sns.Message);
    const { email, verificationToken } = message;

    // Use environment variables for the domain and sender email
    const domain = process.env.DOMAIN;
    const senderEmail = process.env.SENDER_EMAIL;

    const verificationLink = `http://${domain}/v1/verify?user=${encodeURIComponent(
      email
    )}&token=${verificationToken}`;

    const msg = {
      to: email,
      from: senderEmail,
      subject: 'Verify Your Email',
      text: `Please verify your email by clicking the following link: ${verificationLink}`,
    };

    await sendgridMail.send(msg);
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error(`Error in Lambda function: ${error.message}`);
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
};
