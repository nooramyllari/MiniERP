// =========================
// HTML-elementit
// =========================

const productForm = document.getElementById("productForm");
const productNameInput = document.getElementById("productName");
const quantityInput = document.getElementById("quantity");
const priceInput = document.getElementById("price");
const productTableBody = document.getElementById("productTableBody");

// =========================
// Tapahtumat
// =========================

productForm.addEventListener("submit", handleFormSubmit);

// =========================
// Funktiot
// =========================

function handleFormSubmit(event) {

    event.preventDefault();

    const product = getProductData();

    createProductRow(product);

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
        <td>-</td>
    `;

    productTableBody.appendChild(row);

}

// -------------------------

function clearForm() {

    productForm.reset();

}