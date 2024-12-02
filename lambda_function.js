const aws = require('aws-sdk');
const sendgridMail = require('@sendgrid/mail');

const secretsManager = new aws.SecretsManager();

async function getSecret(secretName) {
    const response = await secretsManager.getSecretValue({ SecretId: secretName }).promise();
    return JSON.parse(response.SecretString);
}

exports.handler = async (event) => {
    try {
        const secrets = await getSecret('email_lambda_id');
        sendgridMail.setApiKey(secrets.SENDGRID_API_KEY);

        const message = JSON.parse(event.Records[0].Sns.Message);
        const { email, verificationToken } = message;

        const verificationLink = `https://demo.daminithorat.me/v1/verify?user=${encodeURIComponent(
            email
        )}&token=${verificationToken}`;

        const msg = {
            to: email,
            from: 'no-reply@demo.daminithorat.me',
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
