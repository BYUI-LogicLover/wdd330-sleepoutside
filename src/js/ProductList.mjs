import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  const isDiscounted = product.FinalPrice < product.SuggestedRetailPrice;
  const discountPercent = isDiscounted
    ? Math.round((1 - product.FinalPrice / product.SuggestedRetailPrice) * 100)
    : 0;

  return `
    <li class="product-card">
      <a href="product_pages/?product=${product.Id}">
        ${isDiscounted ? `<span class="product-card__discount-badge">${discountPercent}% OFF</span>` : ""}
        <img src="${product.Image}" alt="${product.Name}">
        <h2>${product.Brand.Name}</h2>
        <h3>${product.NameWithoutBrand}</h3>
        <p class="product-card__price">
          ${isDiscounted ? `<span class="product-card__original-price">$${product.SuggestedRetailPrice.toFixed(2)}</span>` : ""}
          $${product.FinalPrice}
        </p>
      </a>
    </li>
    `;
}

export default class ProductList {
  constructor(category, dataSource, listElement, filterIds = null) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.filterIds = filterIds;
  }

  async init() {
    let list = await this.dataSource.getData();
    if (this.filterIds) {
      list = list.filter((product) => this.filterIds.includes(product.Id));
    }
    this.renderList(list);
  }

  renderList(list) {
    // const htmlStrings = list.map(productCardTemplate);
    // this.listElement.insertAdjacentHTML("afterbegin", htmlStrings.join(""));

    // apply use new utility function instead of the commented code above
    renderListWithTemplate(productCardTemplate, this.listElement, list);

  }

}