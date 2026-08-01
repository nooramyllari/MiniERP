// =========================
// HTML-elementit
// =========================

const productForm = document.getElementById("productForm");
const productNameInput = document.getElementById("productName");
const quantityInput = document.getElementById("quantity");
const priceInput = document.getElementById("price");
const productTableBody = document.getElementById("productTableBody");
const searchInput = document.getElementById("searchInput");

let products = [];

// =========================
// Tapahtumat
// =========================

productForm.addEventListener("submit", handleFormSubmit);
searchInput.addEventListener("input", filterProducts);

// =========================
// Funktiot
// =========================

function handleFormSubmit(event) {

    event.preventDefault();

    const product = getProductData();

    products.push(product);

    saveProducts();

    renderProducts();

    clearForm();

}

// -------------------------

function getProductData() {

    return {

        name: productNameInput.value,

        quantity: Number(quantityInput.value),

        price: Number(priceInput.value)

    };

}

// -------------------------

function createProductRow(product) {

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${product.name}</td>
        <td>${product.quantity}</td>
        <td>${product.price.toFixed(2)} €</td>
        <td>
            <button class="deleteButton">
                Poista
            </button>
        </td>
    `;

    const deleteButton = row.querySelector(".deleteButton");

    deleteButton.addEventListener("click", function () {

    const confirmDelete = confirm(
        "Haluatko varmasti poistaa tuotteen?"
    );

    if (confirmDelete) {

        products = products.filter(function (item) {

            return item !== product;

        });

        saveProducts();

        renderProducts();

    }

});

    productTableBody.appendChild(row);

}

// -------------------------

function clearForm() {

    productForm.reset();

}

function saveProducts() {

    localStorage.setItem(
        "products",
        JSON.stringify(products)
    );

}

function loadProducts() {

    const savedProducts = localStorage.getItem("products");

    if (savedProducts) {

        products = JSON.parse(savedProducts);

    }

}

function renderProducts() {

    productTableBody.innerHTML = "";

    products.forEach(function (product) {

        createProductRow(product);

    });

}

loadProducts();

renderProducts();

function filterProducts() {

    const searchText = searchInput.value.toLowerCase();

    const rows = productTableBody.querySelectorAll("tr");

    rows.forEach(function (row) {

        const productName = row.children[0].textContent.toLowerCase();

        if (productName.includes(searchText)) {

            row.style.display = "";

        } else {

            row.style.display = "none";

        }

    });

}