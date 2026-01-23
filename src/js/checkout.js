import { loadHeaderFooter } from './utils.mjs';
import CheckoutProcess from './CheckoutProcess.mjs';

loadHeaderFooter({
  header: '/partials/header.html',
  footer: '/partials/footer.html',
});

const checkoutProcess = new CheckoutProcess('so-cart');
checkoutProcess.init();

// Calculate order total after zip code is filled in
document.getElementById('zip').addEventListener('blur', () => {
  checkoutProcess.calculateOrderTotal();
});

// Handle form submission
document.getElementById('checkout-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.target;

  try {
    const response = await checkoutProcess.checkout(form);
    console.log('Order submitted successfully:', response);
  } catch (error) {
    console.error('Checkout error:', error);
  }
});
