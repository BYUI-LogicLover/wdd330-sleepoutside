import { loadHeaderFooter, alertMessage } from './utils.mjs';
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

  // Check form validity
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  try {
    const response = await checkoutProcess.checkout(form);
    console.log('Order submitted successfully:', response);
    
    // Clear the cart
    localStorage.removeItem('so-cart');
    
    // Redirect to success page
    window.location.href = '/checkout/success.html';
  } catch (error) {
    console.error('Checkout error:', error);
    
    // Show error message to user
    if (error.message) {
      alertMessage(`Checkout failed: ${JSON.stringify(error.message)}`);
    } else {
      alertMessage('Checkout failed. Please check your information and try again.');
    }
  }
});