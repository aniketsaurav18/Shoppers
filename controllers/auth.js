const User = require("../models/user");
const bcrypt = require("bcryptjs");
// const nodemailer = require("nodemailer");
const mailjet = require("node-mailjet");
const crypto = require("crypto");

const Mail_jet = mailjet.apiConnect(
  "03dde369a9176b282551f50ce1e15db1",
  "d71edcb03be61c18096112b691c34392"
);

/*
--- sendgrid requirement and apikeys ---
const sendgridTrasnport = require("@sendgrid/mail");
sendgridTrasnport.setApiKey(
  "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"
);
const second_api_key =
  "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";

 */
exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
    errorMessage: message,
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email or password.");
        return res.redirect("/login");
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/");
            });
          }
          req.flash("error", "Invalid email or password.");
          res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/login");
    });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  console.log(email);
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash("error", "Email already exist!");
        return res.redirect("/signup");
      }
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] },
          });
          return user.save();
        })
        .then((result) => {
          //sending email (needs work)
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
          res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: message,
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with that email found");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        user.save();
      })
      .then((result) => {
        res.redirect("/");
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
                    Email: req.body.email,
                    Name: req.body.email,
                  },
                ],
                Subject: "Reset password",
                TextPart: "Here is your OTP for reseting password",
                HTMLPart: `
                <p>You requested a password reset</p>
                <p>Click this <a href = "http://localhost:3000/reset/${token}">link</a> to set a new password</p>
                `,
              },
            ],
          })
          .then((result) => {
            console.log(result.header);
          })
          .catch((err) => {
            console.log("email error");
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      let message = req.flash("error");
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render("auth/new-password", {
        path: "/reset",
        pageTitle: "New Password",
        errorMessage: message,
        userId: user._id.toString(),
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
