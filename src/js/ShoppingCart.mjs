import { getLocalStorage, setLocalStorage, updateCartCount } from './utils.mjs';

function cartItemTemplate(item) {
  const imageUrl = item.Images?.PrimaryMedium || item.Image || '';
  const color = item.Colors && item.Colors.length > 0 
    ? item.Colors[0].ColorName 
    : 'N/A';
  
  return `<li class="cart-card divider" data-id="${item.Id}">
  <span class="cart-card__remove" data-id="${item.Id}">X</span>
  <a href="#" class="cart-card__image">
    <img src="${imageUrl}" alt="${item.Name}" />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${color}</p>
  <div class="cart-card__quantity">
  <label>Qty: 
    <button class="quantity-btn increase" data-id="${item.Id}">+</button>
    <input type="number" class="quantity-input" value="${item.quantity || 1}" min="1" data-id="${item.Id}" />
    <button class="quantity-btn decrease" data-id="${item.Id}">-</button>
  </label>
</div>
  <p class="cart-card__price">$${(item.FinalPrice * (item.quantity || 1)).toFixed(2)}</p>
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
    this.addQuantityListeners();
  }

  addRemoveListeners() {
    document.querySelectorAll(".cart-card__remove").forEach((button) => {
      button.addEventListener("click", (e) => this.removeFromCart(e));
    });
  }

  addQuantityListeners() {
    // Listen for + button clicks
    document.querySelectorAll(".quantity-btn.increase").forEach((button) => {
      button.addEventListener("click", (e) => this.increaseQuantity(e));
    });

    // Listen for - button clicks
    document.querySelectorAll(".quantity-btn.decrease").forEach((button) => {
      button.addEventListener("click", (e) => this.decreaseQuantity(e));
    });

    // Listen for manual input changes
    document.querySelectorAll(".quantity-input").forEach((input) => {
      input.addEventListener("change", (e) => this.updateQuantity(e));
    });
  }

  increaseQuantity(e) {
    const productId = e.target.dataset.id;
    let cartItems = getLocalStorage(this.key) || [];
    
    const item = cartItems.find(item => item.Id === productId);
    if (item) {
      item.quantity = (item.quantity || 1) + 1;
      setLocalStorage(this.key, cartItems);
      this.renderCartContents();
    }
  }

  decreaseQuantity(e) {
    const productId = e.target.dataset.id;
    let cartItems = getLocalStorage(this.key) || [];
    
    const item = cartItems.find(item => item.Id === productId);
    if (item) {
      if (item.quantity > 1) {
        item.quantity = item.quantity - 1;
        setLocalStorage(this.key, cartItems);
        this.renderCartContents();
      } else {
        // If quantity is 1 and user clicks -, remove item
        this.removeItemById(productId);
      }
    }
  }

  updateQuantity(e) {
    const productId = e.target.dataset.id;
    const newQuantity = parseInt(e.target.value);
    
    if (newQuantity < 1) {
      this.removeItemById(productId);
      return;
    }
    
    let cartItems = getLocalStorage(this.key) || [];
    const item = cartItems.find(item => item.Id === productId);
    
    if (item) {
      item.quantity = newQuantity;
      setLocalStorage(this.key, cartItems);
      this.renderCartContents();
    }
  }

  removeFromCart(e) {
    const productId = e.target.dataset.id;
    this.removeItemById(productId);
  }

  removeItemById(productId) {
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
    // Calculate total including quantities
    const total = items.reduce((sum, item) => {
      const quantity = item.quantity || 1;
      return sum + (item.FinalPrice * quantity);
    }, 0);
    
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