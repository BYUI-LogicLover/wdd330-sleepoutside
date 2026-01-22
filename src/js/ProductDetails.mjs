import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    
    // Only render if we actually found a product
    if (this.product) {
      this.renderProductDetails();
      
      const addButton = document.getElementById("add-to-cart");
      if (addButton) {
        addButton.addEventListener("click", this.addProductToCart.bind(this));
      }
    }
  }

  addProductToCart() {
    const cartItems = getLocalStorage("so-cart") || [];
    cartItems.push(this.product);
    setLocalStorage("so-cart", cartItems);
  }

  renderProductDetails() {
    // Pass the product to the template function
    productDetailsTemplate(this.product);
  }
}

function productDetailsTemplate(product) {
  // Use safety checks (optional chaining or if statements) for every element
  const categoryHeader = document.querySelector("h2");
  if (categoryHeader) {
    categoryHeader.textContent = product.Category.charAt(0).toUpperCase() + product.Category.slice(1);
  }

  const brand = document.querySelector("#p-brand");
  if (brand) brand.textContent = product.Brand.Name;

  const name = document.querySelector("#p-name");
  if (name) name.textContent = product.NameWithoutBrand;

  const productImage = document.querySelector("#p-image");
  if (productImage) {
    productImage.src = product.Images.PrimaryExtraLarge;
    productImage.alt = product.NameWithoutBrand;
  }

  const price = document.querySelector("#p-price");
  if (price) {
    const euroPrice = new Intl.NumberFormat('de-DE', {
      style: 'currency', currency: 'EUR',
    }).format(Number(product.FinalPrice) * 0.85);
    price.textContent = `${euroPrice}`;
  }

  const color = document.querySelector("#p-color");
  if (color) color.textContent = product.Colors[0].ColorName;

  const description = document.querySelector("#p-description");
  if (description) description.innerHTML = product.DescriptionHtmlSimple;

  const addButton = document.querySelector("#add-to-cart");
  if (addButton) addButton.dataset.id = product.Id;
}

// ************* Alternative Display Product Details Method *******************
// function productDetailsTemplate(product) {
//   return `<section class="product-detail"> <h3>${product.Brand.Name}</h3>
//     <h2 class="divider">${product.NameWithoutBrand}</h2>
//     <img
//       class="divider"
//       src="${product.Image}"
//       alt="${product.NameWithoutBrand}"
//     />
//     <p class="product-card__price">$${product.FinalPrice}</p>
//     <p class="product__color">${product.Colors[0].ColorName}</p>
//     <p class="product__description">
//     ${product.DescriptionHtmlSimple}
//     </p>
//     <div class="product-detail__add">
//       <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
//     </div></section>`;
// }