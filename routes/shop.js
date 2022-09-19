const path = require("path");

const express = require("express");

const rootDir = require("../util/path");
const adminData = require("./admin");

const router = express.Router();

router.get("/", (req, res, next) => {
  const product = adminData.products;
  res.render("shop", {
    prod: product,
    title: "My Shop",
    path: "/",
    pageTitle: "Shop",
    hasProduct: product.length > 0 ? true : false,
    activeShop: true,
    productCSS: true,
  });
});

module.exports = router;
