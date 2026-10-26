// ELEMENTS
const balanceEl = document.getElementById("balance");
const incomeAmountEl = document.getElementById("income-amount");
const expenseAmountEl = document.getElementById("expense-amount");
const transactionListEl = document.getElementById("transaction-list");
const transactionCountEl = document.getElementById("transaction-count");
const emptyStateEl = document.getElementById("empty-state");
const transactionForm = document.getElementById("transaction-form");
const descriptionEl = document.getElementById("description");
const amountEl = document.getElementById("amount");
const typeEl =document.getElementById("type");
const categoryEl = document.getElementById("category");
const dateEl = document.getElementById("date");
const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");
const formTitle = document.getElementById("form-title");
const searchEl = document.getElementById("search");
const typeFilterEl = document.getElementById("type-filter");
const categoryFilterEl = document.getElementById("category-filter");
const clearAllBtn = document.getElementById("clear-all-btn");
const themeBtn = document.getElementById("theme-btn");



// DATA

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let editingId = null;
let expenseChart = null;



// DEFAULT DATE
dateEl.value = new Date().toISOString().split("T")[0];

// ADD / EDIT TRANSACTION

transactionForm.addEventListener("submit",
    function (e) {

        e.preventDefault();

        const description = descriptionEl.value.trim();
        const amount = parseFloat(amountEl.value);
        const type = typeEl.value;
        const category = categoryEl.value;
        const date = dateEl.value;


        // Validation
        if (!description) {
            alert("Please enter a description.");
            return;
        }


        if (isNaN(amount) || amount <= 0) {
           alert("Please enter a valid amount.");
           return;
        }


        if (!date) {

            alert("Please select a date.");

            return;
        }


        const finalAmount =
            type === "expense"
                ? -Math.abs(amount)
                : Math.abs(amount);


        // EDIT

        if (editingId !== null) {

            transactions =
                transactions.map(
                    transaction => {

                        if (
                            transaction.id === editingId
                        ) {

                            return {

                                ...transaction,

                                description,

                                amount: finalAmount,

                                type,

                                category,

                                date
                            };
                        }

                        return transaction;
                    }
                );

            editingId = null;

            formTitle.textContent =
                "Add Transaction";

            submitBtn.textContent =
                "Add Transaction";

            cancelBtn.classList.add(
                "hidden"
            );

        }

        // ADD

        else {

            const newTransaction = {

                id: Date.now(),

                description,

                amount: finalAmount,

                type,

                category,

                date
            };


            transactions.push(
                newTransaction
            );
        }


        saveTransactions();

        transactionForm.reset();

        dateEl.value =
            new Date()
                .toISOString()
                .split("T")[0];

        renderAll();
    }
);


// ===============================
// SAVE DATA
// ===============================

function saveTransactions() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );
}


// ===============================
// RENDER TRANSACTIONS
// ===============================

function renderTransactions() {

    transactionListEl.innerHTML = "";


    const search =
        searchEl.value
            .toLowerCase()
            .trim();


    const typeFilter =
        typeFilterEl.value;


    const categoryFilter =
        categoryFilterEl.value;


    const filteredTransactions =
        transactions
            .filter(transaction => {

                const matchesSearch =
                    transaction.description
                        .toLowerCase()
                        .includes(search);


                const matchesType =
                    typeFilter === "all" ||
                    transaction.type === typeFilter;


                const matchesCategory =
                    categoryFilter === "all" ||
                    transaction.category === categoryFilter;


                return (
                    matchesSearch &&
                    matchesType &&
                    matchesCategory
                );
            })
            .sort(
                (a, b) =>
                    new Date(b.date) -
                    new Date(a.date)
            );


    transactionCountEl.textContent =
        `${filteredTransactions.length} ${filteredTransactions.length === 1
            ? "transaction"
            : "transactions"
        }`;


    if (
        filteredTransactions.length === 0
    ) {

        emptyStateEl.style.display =
            "block";

        return;

    } else {

        emptyStateEl.style.display =
            "none";
    }


    filteredTransactions.forEach(
        transaction => {

            const li =
                createTransactionElement(
                    transaction
                );

            transactionListEl.appendChild(
                li
            );
        }
    );
}


// ===============================
// CREATE TRANSACTION ELEMENT
// ===============================

function createTransactionElement(
    transaction
) {

    const li =
        document.createElement("li");


    li.className =
        `transaction ${transaction.type
        }`;


    const formattedAmount =
        formatCurrency(
            Math.abs(transaction.amount)
        );


    const sign =
        transaction.type === "income"
            ? "+"
            : "-";


    const formattedDate =
        formatDate(transaction.date);


    li.innerHTML = `

        <div class="transaction-info">

            <div class="transaction-description">

                ${escapeHTML(
        transaction.description
    )}

            </div>


            <div class="transaction-meta">

                <span class="category">

                    ${escapeHTML(
        transaction.category
    )}

                </span>


                <span class="date">

                    ${formattedDate}

                </span>

            </div>

        </div>


        <div class="transaction-right">

            <span class="transaction-amount">

                ${sign}${formattedAmount}

            </span>


            <div class="action-buttons">

                <button
                    class="edit-btn"
                    onclick="editTransaction(${transaction.id})"
                    title="Edit"
                >
                    ✏️
                </button>


                <button
                    class="delete-btn"
                    onclick="deleteTransaction(${transaction.id})"
                    title="Delete"
                >
                    🗑️
                </button>

            </div>

        </div>
    `;


    return li;
}


// ===============================
// UPDATE SUMMARY
// ===============================

function updateSummary() {

    const balance =
        transactions.reduce(
            (total, transaction) =>
                total + transaction.amount,
            0
        );


    const income =
        transactions
            .filter(
                transaction =>
                    transaction.amount > 0
            )
            .reduce(
                (total, transaction) =>
                    total + transaction.amount,
                0
            );


    const expenses =
        transactions
            .filter(
                transaction =>
                    transaction.amount < 0
            )
            .reduce(
                (total, transaction) =>
                    total +
                    Math.abs(transaction.amount),
                0
            );


    balanceEl.textContent =
        formatCurrency(balance);


    incomeAmountEl.textContent =
        formatCurrency(income);


    expenseAmountEl.textContent =
        formatCurrency(expenses);
}


// ===============================
// CURRENCY
// ===============================

function formatCurrency(amount) {

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR"
        }
    ).format(amount);
}


// ===============================
// DATE FORMAT
// ===============================

function formatDate(date) {

    return new Date(date).toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


// ===============================
// DELETE
// ===============================

function deleteTransaction(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this transaction?"
        );


    if (!confirmed) {

        return;
    }


    transactions =
        transactions.filter(
            transaction =>
                transaction.id !== id
        );


    saveTransactions();

    renderAll();
}


// ===============================
// EDIT
// ===============================

function editTransaction(id) {

    const transaction =
        transactions.find(
            transaction =>
                transaction.id === id
        );


    if (!transaction) {

        return;
    }


    editingId = id;


    descriptionEl.value =
        transaction.description;


    amountEl.value =
        Math.abs(transaction.amount);


    typeEl.value =
        transaction.type;


    categoryEl.value =
        transaction.category;


    dateEl.value =
        transaction.date;


    formTitle.textContent =
        "Edit Transaction";


    submitBtn.textContent =
        "Update Transaction";


    cancelBtn.classList.remove(
        "hidden"
    );


    window.scrollTo({

        top: 0,

        behavior: "smooth"
    });
}


// ===============================
// CANCEL EDIT
// ===============================

cancelBtn.addEventListener(
    "click",
    function () {

        editingId = null;

        transactionForm.reset();

        dateEl.value =
            new Date()
                .toISOString()
                .split("T")[0];

        formTitle.textContent =
            "Add Transaction";

        submitBtn.textContent =
            "Add Transaction";

        cancelBtn.classList.add(
            "hidden"
        );
    }
);


// ===============================
// SEARCH & FILTER
// ===============================

searchEl.addEventListener(
    "input",
    renderTransactions
);


typeFilterEl.addEventListener(
    "change",
    renderTransactions
);


categoryFilterEl.addEventListener(
    "change",
    renderTransactions
);


// ===============================
// CLEAR ALL
// ===============================

clearAllBtn.addEventListener(
    "click",
    function () {

        if (transactions.length === 0) {

            alert(
                "There are no transactions to delete."
            );

            return;
        }


        const confirmed =
            confirm(
                "Are you sure you want to delete ALL transactions?"
            );


        if (!confirmed) {

            return;
        }


        transactions = [];

        saveTransactions();

        renderAll();
    }
);


// ===============================
// DARK MODE
// ===============================

themeBtn.addEventListener(
    "click",
    function () {

        document.body.classList.toggle(
            "dark"
        );


        const darkMode =
            document.body.classList.contains(
                "dark"
            );


        localStorage.setItem(
            "darkMode",
            darkMode
        );


        themeBtn.textContent =
            darkMode
                ? "☀️"
                : "🌙";


        updateChart();
    }
);


// Load saved theme

const savedDarkMode =
    localStorage.getItem("darkMode");


if (savedDarkMode === "true") {

    document.body.classList.add("dark");

    themeBtn.textContent = "☀️";
}


// ===============================
// CHART
// ===============================

function updateChart() {

    const categories = {};

    transactions
        .filter(
            transaction =>
                transaction.amount < 0
        )
        .forEach(transaction => {

            const category =
                transaction.category;


            const amount =
                Math.abs(transaction.amount);


            if (!categories[category]) {

                categories[category] = 0;
            }


            categories[category] += amount;
        });


    const labels =
        Object.keys(categories);


    const values =
        Object.values(categories);


    const ctx =
        document
            .getElementById(
                "expense-chart"
            )
            .getContext("2d");


    if (expenseChart) {

        expenseChart.destroy();
    }


    expenseChart =
        new Chart(
            ctx,
            {

                type: "doughnut",

                data: {

                    labels,

                    datasets: [

                        {
                            data: values
                        }

                    ]
                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {

                            position: "bottom",

                            labels: {

                                color:
                                    getComputedStyle(
                                        document.body
                                    ).getPropertyValue(
                                        "--text"
                                    )
                            }
                        }
                    }
                }
            }
        );
}


// ===============================
// ESCAPE HTML
// ===============================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


// ===============================
// RENDER EVERYTHING
// ===============================

function renderAll() {

    updateSummary();

    renderTransactions();

    updateChart();
}


// Initial render

renderAll();