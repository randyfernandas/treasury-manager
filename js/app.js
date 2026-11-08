const transactionTable = document.getElementById("transactionTable");

const totalTransactions = document.getElementById("totalTransactions");
const totalAmount = document.getElementById("totalAmount");
const completedTransactions = document.getElementById("completedTransactions");

const searchType = document.getElementById("searchType");
const searchInput = document.getElementById("searchInput");
const searchLabel = document.getElementById("searchLabel");
const searchButton = document.getElementById("searchButton");
const resetSearchButton = document.getElementById("resetSearchButton");

const searchInfo = document.getElementById("searchInfo");
const searchResult = document.getElementById("searchResult");

const sortAlgorithm = document.getElementById("sortAlgorithm");
const sortField = document.getElementById("sortField");
const sortOrder = document.getElementById("sortOrder");
const sortButton = document.getElementById("sortButton");
const resetSortButton = document.getElementById("resetSortButton");

const sortInfo = document.getElementById("sortInfo");

const recordCount = document.getElementById("recordCount");
const tableDescription = document.getElementById("tableDescription");
const emptyState = document.getElementById("emptyState");

let displayedTransactions = [...transactions];

function formatCurrency(amount) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(amount);
}

function formatDate(date) {
    return new Date(date + "T00:00:00").toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

function getStatusClass(status) {
    return status.toLowerCase();
}

function renderDashboard() {

    const total = transactions.reduce((sum, transaction) => {
        return sum + transaction.amount;
    }, 0);

    const completed = transactions.filter(transaction => {
        return transaction.status === "Completed";
    });

    totalTransactions.textContent = transactions.length;

    totalAmount.textContent = formatCurrency(total);

    completedTransactions.textContent = completed.length;
}

function renderTransactions(data) {

    transactionTable.innerHTML = "";

    recordCount.textContent = `${data.length} Records`;

    if (data.length === 0) {
        emptyState.classList.remove("hidden");
        return;
    }

    emptyState.classList.add("hidden");

    const rows = data.map(transaction => {

        return `
            <tr>
                <td class="transaction-id">#${transaction.id}</td>

                <td>${transaction.customer}</td>

                <td>${formatDate(transaction.date)}</td>

                <td>${transaction.description}</td>

                <td class="amount">
                    ${formatCurrency(transaction.amount)}
                </td>

                <td>
                    <span class="status ${getStatusClass(transaction.status)}">
                        ${transaction.status}
                    </span>
                </td>
            </tr>
        `;
    });

    transactionTable.innerHTML = rows.join("");
}

function updateSearchInput() {

    const selectedType = searchType.value;

    searchInput.value = "";
    searchResult.classList.add("hidden");

    if (selectedType === "linear") {

        searchLabel.textContent = "Customer Name";

        searchInput.placeholder = "Enter customer name...";

        searchInput.type = "text";

        searchInfo.textContent =
            "Linear Search checks each transaction until a matching customer is found.";

    } else {

        searchLabel.textContent = "Transaction ID";

        searchInput.placeholder = "Enter transaction ID...";

        searchInput.type = "number";

        searchInfo.textContent =
            "Binary Search finds a transaction ID by repeatedly dividing a sorted dataset in half.";
    }
}

function handleSearch() {

    const keyword = searchInput.value.trim();

    if (keyword === "") {
        searchResult.className = "search-result not-found";
        searchResult.textContent = "Please enter a search keyword.";
        searchResult.classList.remove("hidden");

        displayedTransactions = [...transactions];
        tableDescription.textContent = "Showing all transactions.";
        renderTransactions(displayedTransactions);

        return;
    }

    let result = null;
    let algorithmName = "";

    if (searchType.value === "linear") {

        result = linearSearch(transactions, keyword);

        algorithmName = "Linear Search";

    } else {

        const targetId = Number(keyword);

        if (!Number.isInteger(targetId)) {
            searchResult.className = "search-result not-found";
            searchResult.textContent = "Please enter a valid transaction ID.";

            searchResult.classList.remove("hidden");

            return;
        }

        const sortedById = [...transactions].sort((a, b) => a.id - b.id);

        result = binarySearch(sortedById, targetId);

        algorithmName = "Binary Search";
    }

    if (result) {

        displayedTransactions = [result];

        searchResult.className = "search-result";

        searchResult.innerHTML = `
            <strong>Transaction Found!</strong><br>
            Algorithm: ${algorithmName}<br>
            Customer: ${result.customer}<br>
            Transaction ID: #${result.id}<br>
            Amount: ${formatCurrency(result.amount)}
        `;

        tableDescription.textContent = "Showing search result.";

    } else {

        displayedTransactions = [];

        searchResult.className = "search-result not-found";

        searchResult.textContent =
            `No transaction found using ${algorithmName}.`;

        tableDescription.textContent = "No matching transactions.";
    }

    searchResult.classList.remove("hidden");

    renderTransactions(displayedTransactions);
}

function resetSearch() {

    searchInput.value = "";

    searchResult.classList.add("hidden");

    displayedTransactions = [...transactions];

    tableDescription.textContent = "Showing all transactions.";

    renderTransactions(displayedTransactions);
}

function handleSort() {

    const algorithm = sortAlgorithm.value;
    const field = sortField.value;
    const order = sortOrder.value;

    if (algorithm === "bubble") {

        displayedTransactions = bubbleSort(
            transactions,
            field,
            order
        );

        sortInfo.textContent =
            "Bubble Sort: O(n²) time complexity. It compares adjacent elements and swaps them when necessary.";

    } else {

        displayedTransactions = mergeSort(
            transactions,
            field,
            order
        );

        sortInfo.textContent =
            "Merge Sort: O(n log n) time complexity. It divides the dataset into smaller parts and merges them in sorted order.";
    }

    searchResult.classList.add("hidden");

    tableDescription.textContent =
        `Sorted by ${field} (${order === "asc" ? "Ascending" : "Descending"}) using ${algorithm === "bubble" ? "Bubble Sort" : "Merge Sort"}.`;

    renderTransactions(displayedTransactions);
}

function resetSort() {

    displayedTransactions = [...transactions];

    searchResult.classList.add("hidden");

    tableDescription.textContent = "Showing all transactions.";

    sortInfo.textContent =
        "Bubble Sort has O(n²) time complexity, while Merge Sort has O(n log n).";

    renderTransactions(displayedTransactions);
}

searchType.addEventListener("change", updateSearchInput);

searchButton.addEventListener("click", handleSearch);

resetSearchButton.addEventListener("click", resetSearch);

searchInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        handleSearch();
    }
});

sortButton.addEventListener("click", handleSort);

resetSortButton.addEventListener("click", resetSort);

function initializeApp() {

    document.getElementById("currentDate").textContent =
        new Date().toLocaleDateString("en-US", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });

    renderDashboard();

    renderTransactions(displayedTransactions);

    updateSearchInput();
}

initializeApp();
