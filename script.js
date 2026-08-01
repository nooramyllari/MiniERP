// =========================
// HTML-elementit
// =========================

const productForm = document.getElementById("productForm");
const productNameInput = document.getElementById("productName");
const quantityInput = document.getElementById("quantity");
const priceInput = document.getElementById("price");
const productTableBody = document.getElementById("productTableBody");
const searchInput = document.getElementById("searchInput");

const productCount = document.getElementById("productCount");
const totalQuantity = document.getElementById("totalQuantity");
const inventoryValue = document.getElementById("inventoryValue");
const averagePrice = document.getElementById("averagePrice");
const sortSelect = document.getElementById("sortSelect");
const chartCanvas =
    document.getElementById("inventoryChart");

let inventoryChart;

// =========================
// Sovelluksen data
// =========================

let products = [];
let editingIndex = null;

// =========================
// Tapahtumat
// =========================

productForm.addEventListener("submit", handleFormSubmit);
searchInput.addEventListener("input", filterProducts);
sortSelect.addEventListener("change", sortProducts);

// =========================
// Käynnistys
// =========================

loadProducts();
renderProducts();

// =========================
// Funktiot
// =========================

function handleFormSubmit(event) {

    event.preventDefault();

    const product = getProductData();

    if (editingIndex === null) {

        products.push(product);

    } else {

        products[editingIndex] = product;

        editingIndex = null;

        document.querySelector("button[type='submit']").textContent =
            "Lisää tuote";

    }

    saveProducts();
    renderProducts();
    clearForm();

}

function getProductData() {

    return {

        name: productNameInput.value,
        quantity: Number(quantityInput.value),
        price: Number(priceInput.value)

    };

}

function renderProducts() {

    productTableBody.innerHTML = "";

    products.forEach(function (product, index) {

        createProductRow(product, index);

    });

    updateDashboard();
    updateChart();

}

function createProductRow(product, index) {

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${product.name}</td>
        <td>${product.quantity}</td>
        <td>${product.price.toLocaleString("fi-FI", {
            style: "currency",
            currency: "EUR"
        })}</td>
        <td>
            <button class="editButton">
                Muokkaa
            </button>

            <button class="deleteButton">
                Poista
            </button>
        </td>
    `;

    const editButton = row.querySelector(".editButton");
    const deleteButton = row.querySelector(".deleteButton");

    editButton.addEventListener("click", function () {

        productNameInput.value = product.name;
        quantityInput.value = product.quantity;
        priceInput.value = product.price;

        editingIndex = index;

        document.querySelector("button[type='submit']").textContent =
            "Päivitä tuote";

    });

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

function updateDashboard() {

    productCount.textContent = products.length;

    const quantity = products.reduce(function (total, product) {

        return total + product.quantity;

    }, 0);

    totalQuantity.textContent = quantity;

    const value = products.reduce(function (total, product) {

        return total + product.quantity * product.price;

    }, 0);

    inventoryValue.textContent = value.toLocaleString("fi-FI", {
        style: "currency",
        currency: "EUR"
    });

    if (products.length === 0) {

        averagePrice.textContent = "0 €";
        return;

    }

    const average = products.reduce(function (total, product) {

        return total + product.price;

    }, 0) / products.length;

    averagePrice.textContent = average.toLocaleString("fi-FI", {
        style: "currency",
        currency: "EUR"
    });

}

function sortProducts() {

    switch (sortSelect.value) {

        case "nameAsc":

            products.sort((a, b) =>
                a.name.localeCompare(b.name)
            );

            break;

        case "nameDesc":

            products.sort((a, b) =>
                b.name.localeCompare(a.name)
            );

            break;

        case "priceAsc":

            products.sort((a, b) =>
                a.price - b.price
            );

            break;

        case "priceDesc":

            products.sort((a, b) =>
                b.price - a.price
            );

            break;

        case "quantityAsc":

            products.sort((a, b) =>
                a.quantity - b.quantity
            );

            break;

        case "quantityDesc":

            products.sort((a, b) =>
                b.quantity - a.quantity
            );

            break;

    }

    renderProducts();

}

function updateChart() {

    if (inventoryChart) {

        inventoryChart.destroy();

    }

    inventoryChart = new Chart(chartCanvas, {

        type: "bar",

        data: {

            labels: products.map(product => product.name),

            datasets: [

                {

                    label: "Varaston arvo (€)",

                    data: products.map(product =>
                        product.quantity * product.price
                    )

                }

            ]

        }

    });

}

function clearForm() {

    productForm.reset();

}

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