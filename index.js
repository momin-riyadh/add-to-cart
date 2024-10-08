const listEl = document.querySelector("#items");
const cartEl = document.querySelector(".cartItems");
const cartTitleEl = document.querySelector(".cartTitle");
const cartTotalEl = document.querySelector("#cartTotal");
const cartBtmContinerEl = document.querySelector(".btmContainer");
const confOverlay = document.querySelector(".confContainer");
const confOverlayCart = document.querySelector(".cartSummary");
const confOverlayCartTotal = document.querySelector("#confCartTotal");
const confOverlayBgBlur = document.querySelector(".blurOverlay");
const requestURL = "https://fakestoreapi.com/products";

let products;
let cart = [];
let cartQty = 0;
let cartTotal = 0;

async function getProducts() {
  try {
    const res = await fetch(requestURL);
    let data = await res.json();
    products = data;

    confOverlay.style.display = "none";

    products.forEach((el) => {
      listEl.insertAdjacentHTML(
        "beforeend",
        `
        <div class="itemCard block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
          <div class="itemImg">
              <img src="${el.image}" class="h-auto max-w-full" alt>
            <button type="button" class="cartAddBtn" class="productImg" id="btn-${
              el.id
            }" onclick="addToCart(${el.id})">
                    <img src="/assets/images/icon-add-to-cart.svg" id="addCartBtn">
                <p>Add to Cart</p>
            </button>
            <button type="button" class="cartAddedBtn" id="btnInCart-${el.id}">
                <div class="chgQtyBtn" id="itmDecBtn-${
                  el.id
                }" onclick = "decCart(${el.id})">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                    <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8"/>
                  </svg>
                </div>
                <p id="btnQty-${el.id}">QTY</p>
                <div class="chgQtyBtn" id="itmIncBtn-${
                  el.id
                }" onclick = "addToCart(${el.id})">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                  </svg>
                </div>
            </button>
          </div>
          <div class="itemInfo">
            <p class="itemInfoCategory">${el.category}</p>
            <p class="itemInfoName">${el.title}</p>
            <p class="itemInfoPrice">$${el.price.toFixed(2)}</p>
          </div>
        </div>`
      );
    });

    updateCart(); // Add this line to initialize the cart display
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

function updateCart() {
  if (cart.length === 0) {
    // Reset cart totals when empty
    cartQty = 0;
    cartTotal = 0;
    
    cartBtmContinerEl.style.visibility = "hidden";
    cartBtmContinerEl.style.height = "0";
    cartTitleEl.innerHTML = `Your Cart (${cartQty})`;
    cartEl.style.alignItems = "center";
    cartEl.style.justifyContent = "space-evenly";

    cartEl.innerHTML = `
      <img class="cartPlacHolderImg" src="assets/images/illustration-empty-cart.svg">
      <p class="cartPlaceHolder">Your added items will appear here</p>
    `;
  } else {
    cartEl.innerHTML = "";

    cart.forEach((el) => {
      cartEl.innerHTML += `
          <div class="cartItem">
            <span>
              <p id="cartItmName">${el.itemName}</p>
              <p class="cartItmPricing" id="cartItmQty">${el.itemQty} x </p>
              <p class="cartItmPricing" id="cartItmUnitPrice">$${el.itemPrice}</p>
              <p class="cartItmPricing" id="cartItmUnitTotal">$${(el.itemQty * el.itemPrice).toFixed(2)}</p>
            </span>
            <button type="button" id="btn-remove-${el.id}" onclick="rmvCart(${el.id})">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path fill="#CAAFA7" d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"/></svg>
            </button>
        </div>`;
    });

    cartTitleEl.innerHTML = `
      Your Cart (${cartQty})
    `;
    cartTotalEl.innerHTML = `
      $${cartTotal.toFixed(2)}
    `;
    cartBtmContinerEl.style.visibility = "visible";
    cartBtmContinerEl.style.height = "200px";
  }

  // Update cart total display
  cartTotalEl.innerHTML = `$${cartTotal.toFixed(2)}`;
}

function chkQty(clickedID) {
  cart.forEach((el) => {
    if (el.itemQty === 0) {
      let idToCartIdx = cart.findIndex((el) => el.id === clickedID);
      cart.splice(idToCartIdx, 1);

      document.querySelector("#btn-" + el.id + ".cartAddBtn").style.visibility =
        "visible";
      document.querySelector("#btn-" + el.id + ".cartAddBtn").style.display =
        "flex";
      document.querySelector(
        "#btnInCart-" + el.id + ".cartAddedBtn"
      ).style.visibility = "hidden";
      document.querySelector(
        "#btnInCart-" + el.id + ".cartAddedBtn"
      ).style.display = "none";
    }
  });

  updateCart(clickedID);
}

function addToCart(clickedID) {
  let product = products.find(p => p.id === clickedID);
  if (!product) {
    console.error('Product not found');
    return;
  }

  let cartItem = cart.find(item => item.id === clickedID);
  if (cartItem) {
    cartItem.itemQty++;
  } else {
    cart.push({
      id: clickedID,
      itemName: product.title,
      itemPrice: product.price,
      itemQty: 1,
      itemImg: product.image,
    });
  }

  cartQty++;
  cartTotal += product.price;

  updateCartButton(clickedID);
  updateCart();
}

function decCart(clickedID) {
  let cartIndex = cart.findIndex(item => item.id === clickedID);
  if (cartIndex === -1) {
    console.error('Item not found in cart');
    return;
  }

  let cartItem = cart[cartIndex];
  let product = products.find(p => p.id === clickedID);

  if (!product) {
    console.error('Product not found');
    return;
  }

  cartItem.itemQty--;
  cartQty--;
  cartTotal -= product.price;

  if (cartItem.itemQty === 0) {
    cart.splice(cartIndex, 1);
  }

  updateCartButton(clickedID);
  updateCart();
}

function updateCartButton(clickedID) {
  let cartItem = cart.find(item => item.id === clickedID);
  let addBtn = document.querySelector(`#btn-${clickedID}.cartAddBtn`);
  let addedBtn = document.querySelector(`#btnInCart-${clickedID}.cartAddedBtn`);
  let qtyDisplay = document.querySelector(`#btnQty-${clickedID}`);

  if (cartItem && cartItem.itemQty > 0) {
    addBtn.style.visibility = 'hidden';
    addBtn.style.display = 'none';
    addedBtn.style.visibility = 'visible';
    addedBtn.style.display = 'flex';
    qtyDisplay.textContent = cartItem.itemQty;
  } else {
    addBtn.style.visibility = 'visible';
    addBtn.style.display = 'flex';
    addedBtn.style.visibility = 'hidden';
    addedBtn.style.display = 'none';
    qtyDisplay.textContent = 'QTY';
  }
}

function rmvCart(clickedID) {
  let cartIndex = cart.findIndex((item) => item.id === clickedID);
  if (cartIndex === -1) {
    console.error('Item not found in cart');
    return;
  }

  let cartItem = cart[cartIndex];
  let product = products.find(p => p.id === clickedID);

  if (!product) {
    console.error('Product not found');
    return;
  }

  cartQty -= cartItem.itemQty;
  cartTotal -= product.price * cartItem.itemQty;
  
  cart.splice(cartIndex, 1);

  updateCartButton(clickedID);
  updateCart();
}

function confirmCart() {
  confOverlayCart.innerHTML = ""; // Clear previous content
  cart.forEach((el) => {
    confOverlayCart.innerHTML += `
      <div class="confCartContainer">
        <div class="confCartItem">
          <img src="${el.itemImg}" class="w-10 h-10 rounded-full" alt="">
          <span>
            <p id="cartItmName">${el.itemName}</p>
            <p class="cartItmPricing" id="cartItmQty">${el.itemQty}x</p>
            <p class="cartItmPricing" id="cartItmUnitPrice">@ $${el.itemPrice}</p>
          </span>
          <div class="cartItmtTotalCnt">
            <p class="cartItmPricing" id="confCartItmUnitTotal">$${(el.itemQty * el.itemPrice).toFixed(2)}</p>
          </div>
        </div>
      </div>`;
  });

  confOverlayCartTotal.innerHTML = `$${cartTotal.toFixed(2)}`;

  confOverlayBgBlur.style.visibility = "visible";
  confOverlay.style.display = "flex";
  window.scrollTo(0, 0);

  cart.forEach((el) => {
    document.querySelector("#btn-" + el.id + ".cartAddBtn").style.visibility =
      "visible";
    document.querySelector("#btn-" + el.id + ".cartAddBtn").style.display =
      "flex";
    document.querySelector(
      "#btnInCart-" + el.id + ".cartAddedBtn"
    ).style.visibility = "hidden";
  });

  cart = [];
  cartQty = 0;
  cartTotal = 0;
  chkQty();
  updateCart();
}

function newOrder() {
  confOverlay.style.display = "none";
  confOverlayBgBlur.style.visibility = "hidden";
}

document.addEventListener('DOMContentLoaded', () => {
  getProducts();
});
