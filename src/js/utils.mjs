export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

export function getLocalStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (e) {
    return null;
  }
}

export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function setClick(selector, callback) {
  const element = qs(selector);
  if (element) {
    element.addEventListener('touchend', (event) => {
      event.preventDefault();
      callback();
    });
    element.addEventListener('click', callback);
  }
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

export function renderListWithTemplate(templateFn, parentElement, list, position = "afterbegin", clear = false) {
  if (!parentElement) return;

  const htmlStrings = list.map(templateFn);
  
  if (clear) {
    parentElement.innerHTML = '';
  }
  
  parentElement.insertAdjacentHTML(position, htmlStrings.join(''));
}

export function renderWithTemplate(template, parentElement, data, callback) {
  if (!parentElement) return;

  const htmlStrings = data.map(template);
  if (callback) {
    callback();
  }
  parentElement.insertAdjacentHTML('afterbegin', htmlStrings.join(''));
}

export function loadTemplate(path) {
  return fetch(path)
    .then((response) => response.text())
    .then((templateString) => templateString);
}

export function loadHeaderFooter(paths) {
  const headerPromise = fetch(paths.header)
    .then((response) => response.text())
    .then((data) => {
      document.getElementById('header').innerHTML = data;
      updateCartCount();
    });
  const footerPromise = fetch(paths.footer)
    .then((response) => response.text())
    .then((data) => {
      document.getElementById('footer').innerHTML = data;
    });
  return Promise.all([headerPromise, footerPromise]);
}

export function updateCartCount() {
  const cartItems = getLocalStorage("so-cart") || [];
  const countElement = document.getElementById("cart-count");
  if (countElement) {
    const count = cartItems.length;
    countElement.textContent = count;
    if (count > 0) {
      countElement.classList.add("has-items");
    } else {
      countElement.classList.remove("has-items");
    }
  }
}

export function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};

  formData.forEach((value, key) => {
    convertedJSON[key] = value;
  });

  return convertedJSON;
}