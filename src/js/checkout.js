import { loadHeaderFooter, setLocalStorage, alertMessage, removeAllAlerts } from './utils.mjs';
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
    // Clear the cart and redirect to success page
    setLocalStorage('so-cart', []);
    window.location.href = '/checkout/success.html';
  } catch (error) {
    console.error('Checkout error:', error);
    // Clear any existing alerts before showing new ones
    removeAllAlerts();

    // Handle multiple error messages (comma-separated from server)
    const errorMessage = error.message || 'There was a problem with your order. Please try again.';
    const errors = errorMessage.split(',').map(msg => msg.trim()).filter(msg => msg);

    // Display each error as a separate alert (reverse order so first error appears at top)
    errors.reverse().forEach(msg => {
      alertMessage(msg, false);
    });

    // Scroll to top once after all alerts are added
    window.scrollTo(0, 0);
  }
});
