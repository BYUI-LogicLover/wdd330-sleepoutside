import { getLocalStorage, setLocalStorage, updateCartCount } from './utils.mjs';

function cartItemTemplate(item) {
  // Safely get image - fallback to a default or empty string
  const imageUrl = item.Images?.PrimaryMedium || item.Image || '';
  
  // Safely get color - check if Colors array exists and has items
  const color = item.Colors && item.Colors.length > 0 
    ? item.Colors[0].ColorName 
    : 'N/A';
  
  return `<li class="cart-card divider">
  <span class="cart-card__remove" data-id="${item.Id}">X</span>
  <a href="#" class="cart-card__image">
    <img src="${imageUrl}" alt="${item.Name}" />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${color}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;
}

export default class ShoppingCart {
  constructor(key, parentSelector) {
    this.key = key;
    this.parentSelector = parentSelector;
  }

  async renderCartContents() {
    const cartItems = getLocalStorage(this.key);
    
    if (!cartItems || cartItems.length === 0) {
      document.querySelector(this.parentSelector).innerHTML =
        '<p>Your cart is empty</p>';
      document.querySelector('.cart-footer')?.classList.add('hide');
      return;
    }

    const htmlItems = cartItems.map(cartItemTemplate);
    document.querySelector(this.parentSelector).innerHTML = htmlItems.join('');
    
    this.calculateTotal(cartItems);
    this.addRemoveListeners();
  }

  addRemoveListeners() {
    document.querySelectorAll(".cart-card__remove").forEach((button) => {
      button.addEventListener("click", (e) => this.removeFromCart(e));
    });
  }

  removeFromCart(e) {
    const productId = e.target.dataset.id;
    let cartItems = getLocalStorage(this.key) || [];
    const index = cartItems.findIndex((item) => item.Id === productId);
    
    if (index !== -1) {
      cartItems.splice(index, 1);
    }
    
    setLocalStorage(this.key, cartItems);
    this.renderCartContents();
    updateCartCount();
  }

  calculateTotal(items) {
    const total = items.reduce((sum, item) => sum + item.FinalPrice, 0);
    
    const cartFooter = document.querySelector('.cart-footer');
    const cartTotal = document.querySelector('.cart-total');
    
    if (cartFooter) {
      cartFooter.classList.remove('hide');
    }
    
    if (cartTotal) {
      cartTotal.textContent = `Total: $${total.toFixed(2)}`;
    }
  }
}