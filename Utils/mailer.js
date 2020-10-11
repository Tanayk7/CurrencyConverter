require("dotenv").config();
const mailer = require("nodemailer");

const transporter = mailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendMail = (
  res,
  mailOptions = {
    from: "Currency Converter",
    to: "tanaykulkarni7@gmail.com",
    subject: "Currency conversion results",
    text: "Results here",
    html: "",
  }
) => {
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.send({ success: false });
    } else {
      console.log("Email sent: " + info.response);
      res.send({ success: true });
    }
  });
};

module.exports = sendMail;
