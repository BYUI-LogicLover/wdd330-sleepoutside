import { loadHeaderFooter } from "./utils.mjs";
import ShoppingCart from "./ShoppingCart.mjs";

loadHeaderFooter({
  header: "/partials/header.html",
  footer: "/partials/footer.html",
});

const cart = new ShoppingCart("so-cart", ".product-list");
cart.renderCartContents();
