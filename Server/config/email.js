var nodemailer = require("nodemailer");
var smtpTransport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "asalik13@gmail.com",
    pass: "dorwssap"
  }
});
var rand, mailOptions, host, link;

function sendMail(to, subject, html) {
  mailOptions = {
    from: "asalik13@gmail.com",
    to: to,
    subject: subject,
    html: html
  };

  smtpTransport.sendMail(mailOptions, function(error, response) {
    if (error) {
      console.log(error);
      res.end("error");
    } else {
      console.log("Message sent: " + response.message);
      res.end("sent");
    }
  });
}
module.exports = sendMail
