import { getLocalStorage, setLocalStorage, updateCartCount } from './utils.mjs';

function cartItemTemplate(item) {
  return `<li class="cart-card divider">
  <span class="cart-card__remove" data-id="${item.Id}">X</span>
  <a href="#" class="cart-card__image">
    <img src="${item.Images.PrimaryMedium}" alt="${item.Name}" />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
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
    // CHECKLIST ITEM 2: Check if there's anything in the cart
    const cartItems = getLocalStorage(this.key);
    
    if (!cartItems || cartItems.length === 0) {
      // Cart is empty
      document.querySelector(this.parentSelector).innerHTML =
        '<p>Your cart is empty</p>';
      // Keep the cart-footer hidden
      document.querySelector('.cart-footer').classList.add('hide');
      return;
    }

    // ✅ CHECKLIST ITEM 3: If there are items, show them and calculate total
    const htmlItems = cartItems.map(cartItemTemplate);
    document.querySelector(this.parentSelector).innerHTML = htmlItems.join('');

    // Calculate and display total
    this.calculateTotal(cartItems);

    // Add event listeners to remove buttons
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
    // CHECKLIST ITEM 3: Calculate the total of the items
    const total = items.reduce((sum, item) => sum + item.FinalPrice, 0);
    
    // CHECKLIST ITEM 3: Display it and insert into the element
    const cartFooter = document.querySelector('.cart-footer');
    const cartTotal = document.querySelector('.cart-total');
    
    // Show the cart-footer (remove hide class)
    cartFooter.classList.remove('hide');
    
    // Update the total text
    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
  }
}