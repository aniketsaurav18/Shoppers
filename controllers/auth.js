exports.getLogin = (req, res, next) => {
  const isLoggedin =
    req.get("Cookie").split(";")[1].trim().split("=")[1] === "true";
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: isLoggedin,
  });
};

exports.postLogin = (req, res, next) => {
  res.setHeader("Set-Cookie", "loggedIn = true");
  res.redirect("/");
};
