const AWS = require('aws-sdk');
const ses = new AWS.SES();

exports.handler = async (event) => {
  try {
    const message = JSON.parse(event.Records[0].Sns.Message);
    const { email, verificationToken } = message;

    const verificationLink = `https://daminithorat.me/verify?user=${encodeURIComponent(
      email
    )}&token=${verificationToken}`;

    const emailParams = {
      Destination: { ToAddresses: [email] },
      Message: {
        Body: {
          Text: {
            Data: `Please verify your email by clicking the following link: ${verificationLink}`,
          },
        },
        Subject: { Data: 'Verify Your Email' },
      },
      Source: process.env.SES_EMAIL_SOURCE,
    };

    await ses.sendEmail(emailParams).promise();
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error(`Error in Lambda function: ${error.message}`);
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
};
