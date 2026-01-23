import Alert from './alert.js';
import ExternalServices from './ExternalServices.mjs';
import ProductList from './ProductList.mjs';
import { loadHeaderFooter } from './utils.mjs';

loadHeaderFooter({
  header: '/partials/header.html',
  footer: '/partials/footer.html',
});

const alerts = new Alert();
alerts.init();

const dataSource = new ExternalServices();
const element = document.querySelector(".product-list");

// Only display products that have detail pages
const productIdsWithDetailPages = ["880RR", "985RF", "985PR", "344YJ"];

const productList = new ProductList(
  "Tents",
  dataSource,
  element,
  productIdsWithDetailPages,
);
productList.init();
