import nodemailer from "nodemailer";

export const sendEmail = async (email, subject, text) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });

    let mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: subject,
      // text: text,
      html: text,
    };

    // Gửi email
    await transporter.sendMail(mailOptions);
    console.log("New password sent successfully!");
  } catch (error) {
    console.error("Error sending OTP email:", error);
  }
};
