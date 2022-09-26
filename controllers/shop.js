const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
    });
  });
};

exports.getProductDetails = (req,res,next)=>{
  const prodId = req.params.productId;
  Product.findbyId(prodId,product1 => {
    console.log(product1);
  })
  res.redirect("/");
}

exports.getIndex = (req,res,next)=>{
    Product.fetchAll((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    });
}

exports.getCart = (req, res, next) => {
    res.render("shop/cart", {
      path: "/cart",
      pageTitle:"Your Cart",
    });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "My orders",
  });
};

exports.getCheckout = (req,res,next)=>{
    res.render("shop/checkout", {
      path: "/checkout",
      pageTitle: "Checkout",
    });
}