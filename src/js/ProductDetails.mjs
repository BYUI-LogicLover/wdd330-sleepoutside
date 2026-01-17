import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    // use the datasource to get the details for the current product. findProductById will return a promise! use await or .then() to process it
    this.product = await this.dataSource.findProductById(this.productId);
    // the product details are needed before rendering the HTML
    this.renderProductDetails();
    // once the HTML is rendered, add a listener to the Add to Cart button
    // Notice the .bind(this). This callback will not work if the bind(this) is missing. Review the readings from this week on "this" to understand why.
    document
      .getElementById("addToCart")
      .addEventListener("click", this.addProductToCart.bind(this));
  }

  addProductToCart() {
    const cartItems = getLocalStorage("so-cart") || [];
    cartItems.push(this.product);
    setLocalStorage("so-cart", cartItems);
  }

  renderProductDetails() {
    productDetailsTemplate(this.product);
  }
}

function productDetailsTemplate(product) {
  // Check if there's a discount
  const hasDiscount = product.SuggestedRetailPrice > product.FinalPrice;
  
  // Update brand and product name
  document.querySelector("h2").textContent = product.Brand.Name;
  document.querySelector("h3").textContent = product.NameWithoutBrand;

  // Update product image - use Images.PrimaryLarge instead of Image
  const productImage = document.getElementById("productImage");
  productImage.src = product.Image;
  productImage.alt = product.NameWithoutBrand;

  // Update price with discount display
  const priceElement = document.getElementById("productPrice");
  if (hasDiscount) {
    const discountAmount = product.SuggestedRetailPrice - product.FinalPrice;
    const discountPercent = Math.round((discountAmount / product.SuggestedRetailPrice) * 100);
    
    // Add discount badge before price
    const discountHTML = `<p class="product-detail__discount">Save ${discountPercent}%!</p>`;
    priceElement.insertAdjacentHTML('beforebegin', discountHTML);
    
    // Show strikethrough original price and final price
    priceElement.innerHTML = `
      <span class="product-card__price--original">$${product.SuggestedRetailPrice.toFixed(2)}</span>
      $${product.FinalPrice.toFixed(2)}
    `;
  } else {
    priceElement.textContent = `$${product.FinalPrice.toFixed(2)}`;
  }

  // Update color and description
  document.getElementById("productColor").textContent = product.Colors[0].ColorName;
  document.getElementById("productDesc").innerHTML = product.DescriptionHtmlSimple;
  document.getElementById("addToCart").dataset.id = product.Id;
}