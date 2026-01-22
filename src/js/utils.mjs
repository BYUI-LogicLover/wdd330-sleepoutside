export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
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

export async function loadHeaderFooter(paths) {
  const headerPath = paths?.header || "/partials/header.html";
  const footerPath = paths?.footer || "/partials/footer.html";
  
  const headerTemplate = await loadTemplate(headerPath);
  const footerTemplate = await loadTemplate(footerPath);

  const headerElement = document.getElementById("header");
  const footerElement = document.getElementById("footer");

  if (headerElement) {
    headerElement.innerHTML = headerTemplate;
  }
  
  if (footerElement) {
    footerElement.innerHTML = footerTemplate;
  }
}