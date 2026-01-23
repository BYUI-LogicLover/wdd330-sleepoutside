import Alert from './alert.js';
import ExternalServices from './ExternalServices.mjs';
import ProductList from './ProductList.mjs';
import { loadHeaderFooter } from './utils.mjs';

async function initPage() {
  // 1. Wait for the header and footer to load first
  await loadHeaderFooter({
    header: '/partials/header.html',
    footer: '/partials/footer.html',
  });

  // 2. Now that the DOM is fully structured, init the alerts
  const alerts = new Alert();
  alerts.init();

  // 3. Init the product list
  const dataSource = new ExternalServices();
  const element = document.querySelector('.product-list');
  const productIdsWithDetailPages = ['880RR', '985RF', '985PR', '344YJ'];

  const productList = new ProductList(
    'Tents',
    dataSource,
    element,
    productIdsWithDetailPages,
  );
  productList.init();
}

initPage();
