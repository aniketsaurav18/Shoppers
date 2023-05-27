const mailjet = require("node-mailjet");
require("dotenv").config();
const Mail_jet = mailjet.apiConnect(
  process.env.MAILJET_API_KEY,
  process.env.MAILJET_SECRET_KEY
);

const mailHandler = (email) => {
  Mail_jet.post("send", { version: "v3.1" })
    .request({
      Messages: [
        {
          From: {
            Email: "mailittoaniket@gmail.com",
            Name: "Shopers",
          },
          To: [
            {
              Email: email,
              Name: email,
            },
          ],
          Subject: "Welcome to shopers",
          TextPart: "welcome to shopers",
          HTMLPart: "<strong>Happy Shoping</strong>",
        },
      ],
    })
    .then((result) => {
      // console.log(result.header);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.mailHandler = mailHandler;
