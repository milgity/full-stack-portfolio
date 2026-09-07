require("dotenv").config();

const transporter = require("./config/email");

async function sendTestEmail() {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: "Portfolio Email Test",
            text: "Congratulations! Your portfolio email notification is working."
        });

        console.log("Email sent successfully!");
        console.log("Message ID:", info.messageId);

    } catch (error) {
        console.error("Email sending failed:");
        console.error(error);
    }
}

sendTestEmail();