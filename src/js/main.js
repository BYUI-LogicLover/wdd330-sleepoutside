import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';

const dataSource = new ProductData('tents');
const element = document.querySelector('.product-list');

// Only display products that have detail pages
const productIdsWithDetailPages = ['880RR', '985RF', '985PR', '344YJ'];

const productList = new ProductList(
  'Tents',
  dataSource,
  element,
  productIdsWithDetailPages,
);
productList.init();

fetch('/partials/header.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('header').innerHTML = data;
  });

fetch('/partials/footer.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('footer').innerHTML = data;
  });