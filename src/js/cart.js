import { loadHeaderFooter } from "./utils.mjs";
import ShoppingCart from "./ShoppingCart.mjs";

loadHeaderFooter({
  header: "/partials/header.html",
  footer: "/partials/footer.html",
});

const cart = new ShoppingCart("so-cart", ".product-list");
cart.renderCartContents();

// 2. Render the Wishlist
// We use the same class, but tell it to look at "so-wishlist" 
// and put the items in the ".wishlist-list" element.
const wishlist = new ShoppingCart("so-wishlist", ".wishlist-list");
wishlist.renderCartContents();