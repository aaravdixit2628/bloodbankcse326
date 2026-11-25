// Load saved records from the browser.
let stock = JSON.parse(localStorage.getItem("bloodStock") || "[]");
const form = document.getElementById("stockForm");
const search = document.getElementById("search");

function saveStock() {
    localStorage.setItem("bloodStock", JSON.stringify(stock));
}

// Count calendar days until the entered expiry date.
function daysLeft(date) {
    let today = new Date();
    let start = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
    return (Date.parse(date) - start) / 86400000;
}

function showStock() {
    let table = document.getElementById("inventory");
    let total = 0, low = 0, alerts = 0;
    table.innerHTML = "";
    for (let i = 0; i < stock.length; i++) {
        let item = stock[i];
        let days = daysLeft(item.expiry);
        total += item.quantity;
        if (item.quantity < 5) low++;
        if (days <= 7) alerts++;
        let status = [];
        if (days < 0) status.push("Expired");
        else if (days <= 7) status.push("Expiring soon");
        if (item.quantity < 5) status.push("Low stock");
        let warning = status.length > 0;
        let name = (item.group + " " + item.component).toLowerCase();
        if (!name.includes(search.value.toLowerCase().trim())) continue;
        table.innerHTML += `<tr>
            <td>${item.group}</td><td>${item.component}</td>
            <td>${item.quantity}</td><td>${item.collection}</td>
            <td>${item.expiry}</td>
            <td class="${warning ? 'warning' : 'good'}">${warning ? status.join(', ') : 'In stock'}</td>
            <td><button onclick="deleteStock(${i})">Delete</button></td>
        </tr>`;
    }
    if (table.innerHTML === "") table.innerHTML = '<tr><td colspan="7">No records found.</td></tr>';
    document.getElementById("total").textContent = total;
    document.getElementById("records").textContent = stock.length;
    document.getElementById("low").textContent = low;
    document.getElementById("alerts").textContent = alerts;
}

// Add a record when the form is submitted.
form.addEventListener("submit", function(event) {
    event.preventDefault();
    let item = {
        group: document.getElementById("group").value,
        component: document.getElementById("component").value,
        quantity: Number(document.getElementById("quantity").value),
        collection: document.getElementById("collection").value,
        expiry: document.getElementById("expiry").value
    };
    if (item.expiry < item.collection) {
        document.getElementById("message").textContent = "Expiry cannot be before collection.";
        return;
    }
    stock.push(item);
    saveStock();
    form.reset();
    showStock();
    document.getElementById("message").textContent = "Stock added successfully!";
});

function deleteStock(index) {
    if (confirm("Delete this stock record?")) {
        stock.splice(index, 1);
        saveStock();
        showStock();
    }
}

search.addEventListener("input", showStock);
showStock();
