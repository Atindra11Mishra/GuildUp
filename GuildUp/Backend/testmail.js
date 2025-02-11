
const transporter = require("./config/email.js"); // Import the transporter
const nodemailer = require("nodemailer");

async function sendTestEmail() {
    try {
        let info = await transporter.sendMail({
            from: 'w74964808@gmail.com', // Sender
            to: "thejokerburgers@gmail.com", // Receiver's email
            subject: "Test Email",
            text: "Hello, this is a test email!", // Plain text
            html: "<b>Hello, this is a test email!</b>", // HTML content
        });

        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info)); // View email in Ethereal
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

sendTestEmail();
