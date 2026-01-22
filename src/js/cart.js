import { getLocalStorage, setLocalStorage, updateCartCount } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");

  // Add event listeners to remove buttons
  document.querySelectorAll(".cart-card__remove").forEach((button) => {
    button.addEventListener("click", removeFromCart);
  });
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <span class="cart-card__remove" data-id="${item.Id}">X</span>
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

function removeFromCart(e) {
  const productId = e.target.dataset.id;
  let cartItems = getLocalStorage("so-cart") || [];
  const index = cartItems.findIndex((item) => item.Id === productId);
  if (index !== -1) {
    cartItems.splice(index, 1);
  }
  setLocalStorage("so-cart", cartItems);
  renderCartContents();
  updateCartCount();
}

fetch("/partials/header.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("header").innerHTML = data;
    updateCartCount();
  });

fetch("/partials/footer.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("footer").innerHTML = data;
  });

renderCartContents();
