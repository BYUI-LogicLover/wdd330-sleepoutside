import { getLocalStorage, formDataToJSON } from './utils.mjs';
import ExternalServices from './ExternalServices.mjs';

export default class CheckoutProcess {
  constructor(key) {
    this.key = key;
    this.cartItems = [];
    this.subtotal = 0;
    this.tax = 0;
    this.shipping = 0;
    this.orderTotal = 0;
  }

  init() {
    this.cartItems = getLocalStorage(this.key) || [];
    this.calculateItemSubtotal();
  }

  calculateItemSubtotal() {
    this.subtotal = this.cartItems.reduce((sum, item) => sum + item.FinalPrice, 0);
    document.getElementById('subtotal').textContent = `$${this.subtotal.toFixed(2)}`;
  }

  calculateOrderTotal() {
    // Tax: 6% of subtotal
    this.tax = this.subtotal * 0.06;

    // Shipping: $10 for first item + $2 for each additional item
    const itemCount = this.cartItems.length;
    this.shipping = itemCount > 0 ? 10 + (itemCount - 1) * 2 : 0;

    // Order total
    this.orderTotal = this.subtotal + this.tax + this.shipping;

    // Display the values
    document.getElementById('tax').textContent = `$${this.tax.toFixed(2)}`;
    document.getElementById('shipping').textContent = `$${this.shipping.toFixed(2)}`;
    document.getElementById('orderTotal').textContent = `$${this.orderTotal.toFixed(2)}`;
  }

  packageItems(items) {
    // Convert the list of products from localStorage to a simpler form for checkout
    return items.map(item => ({
      id: item.Id,
      name: item.Name,
      price: item.FinalPrice,
      quantity: 1
    }));
  }

  async checkout(form) {
    const externalServices = new ExternalServices();

    // Convert the form data to a JSON object
    const order = formDataToJSON(form);

    // Add order details
    order.orderDate = new Date().toISOString();
    order.orderTotal = this.orderTotal;
    order.tax = this.tax;
    order.shipping = this.shipping;
    order.items = this.packageItems(this.cartItems);

    // Send the order to the server
    const response = await externalServices.checkout(order);
    return response;
  }
}
