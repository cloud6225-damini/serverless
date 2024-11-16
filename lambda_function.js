const sendgridMail = require('@sendgrid/mail');
sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.handler = async (event) => {
  try {
    const message = JSON.parse(event.Records[0].Sns.Message);
    const { email, verificationToken } = message;

    const verificationLink = `http://demo.daminithorat.me/v1/verify?user=${encodeURIComponent(
      email
    )}&token=${verificationToken}`;

    const msg = {
      to: email,
      from: 'no-reply@demo.daminithorat.me', // Hardcoded sender email
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
