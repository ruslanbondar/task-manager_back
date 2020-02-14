const nodemailer = require("nodemailer");

let transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "2f821ca582f8d3",
        pass: "a282f8102ee0eb"
    }
  });
  
  const message = {
    from: 'elonmusk@tesla.com', // Sender address
    to: 'to@email.com',         // List of recipients
    subject: 'Design Your Model S | Tesla', // Subject line
    text: 'Have the most fun you can in a car. Get your Tesla today!' // Plain text body
  };
  transport.sendMail(message, function(err, info) {
    if (err) {
      console.log(err)
    } else {
      console.log(info);
    }
  });

// const sgMail = require('@sendgrid/mail');

// const sendGridToken = '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';

// sgMail.setApiKey(sendGridToken);
// const msg = {
//     to: 'mailofbondik@gmail.com',
//     from: 'mailofbondik@gmail.com',
//     subject: 'Sending with Twilio SendGrid is Fun',
//     text: 'Hello, Ruslan',
// };
// sgMail.send(msg);