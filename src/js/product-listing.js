import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

loadHeaderFooter({
  header: "/partials/header.html",
  footer: "/partials/footer.html",
});

const category = getParam("category");

// Capitalize and format the category name for display
const categoryDisplay = category
  ? category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  : "Products";

// Update the page title
const titleElement = document.querySelector(".product-title");
if (titleElement) {
  titleElement.textContent = `Top Products: ${categoryDisplay}`;
}

const dataSource = new ProductData();
const listElement = document.querySelector(".product-list");

const myList = new ProductList(category, dataSource, listElement);
myList.init();
