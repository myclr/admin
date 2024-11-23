// email updated on NOV.6
// Get the admin email from localStorage
const adminEmail = localStorage.getItem('adminEmail') || 'admin@example.com';

// Display the admin email in the placeholder element
document.getElementById('adminEmail').textContent = adminEmail;

window.onload = function() {
    //Log out
    document.getElementById('logoutLink').addEventListener('click', function(event) {
        event.preventDefault(); // Prevent immediate redirection
        document.getElementById('logoutModal').classList.add('show'); // Show the modal
    });

    document.getElementById('confirmLogout').addEventListener('click', function() {
        window.location.href = "adminLogin.html"; // Redirect if YES is clicked
    });

    document.getElementById('cancelLogout').addEventListener('click', function() {
        document.getElementById('logoutModal').classList.remove('show'); // Hide the modal if NO is clicked
    });
}; 

// Function to generate PDF
document.getElementById('generatePDF').addEventListener('click', function () {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text("Total Sales Data", 105, 10, { align: 'center' });  // Center title text

    // Get the current rows of the table based on the current sort/view
    const table = document.getElementById('salesTable');
    const rows = Array.from(table.querySelectorAll('tbody tr'));
    const tableData = rows.map(row => [
        row.cells[0].innerText, // Program
        row.cells[1].innerText, // Layout
        row.cells[2].innerText, // Quantity
        row.cells[3].innerText, // Timestamp
        row.cells[4].innerText  // Total amount
    ]);

    // Calculate total amount for the PDF
    let totalAmount = 0;
    rows.forEach(row => {
        totalAmount += parseFloat(row.cells[4].innerText.replace(/[^0-9.-]+/g, "")) || 0; // Remove non-numeric characters
    });

    // Create PDF table based on the current view
    doc.autoTable({
        head: [['Program', 'Layout', 'Quantity', 'Timestamp', 'Total (PHP)']],
        body: tableData,
        theme: 'grid',
        styles: {
            halign: 'center',
            valign: 'middle',
            fontSize: 9,
        },
        headStyles: {
            halign: 'center',
        },
        bodyStyles: {
            halign: 'center',
        },
        margin: { top: 20 },
    });

    // Add a row for the total sales amount
    doc.autoTable({
        startY: doc.autoTable.previous.finalY + 10,
        body: [['', '', '', 'Total Sales Amount:', `PHP ${totalAmount.toFixed(2)}`]], // Add total sales amount
        theme: 'plain',
        styles: {
            halign: 'right',
            fontSize: 10,
        },
    });

    doc.save("Total_Sales.pdf");
});


document.getElementById('sortOptions').addEventListener('change', function () {
    const selectedOption = this.value;
    const table = document.getElementById('salesTable');
    const rowsArray = Array.from(table.querySelectorAll('tbody tr'));

    rowsArray.sort((rowA, rowB) => {
        let cellA, cellB;
        switch (selectedOption) {
            case 'program':
                cellA = rowA.cells[0].innerText.toLowerCase();
                cellB = rowB.cells[0].innerText.toLowerCase();
                return cellA > cellB ? 1 : -1;

            case 'layout':
                cellA = rowA.cells[1].innerText.toLowerCase();
                cellB = rowB.cells[1].innerText.toLowerCase();
                return cellA > cellB ? 1 : -1;

            case 'timestamp':
                // Parse as Date and sort from latest to oldest
                cellA = new Date(rowA.cells[3].innerText);
                cellB = new Date(rowB.cells[3].innerText);
                return cellA < cellB ? 1 : -1; // Latest date first

            case 'quantity':
                // Parse as integer and sort from highest to lowest
                cellA = parseInt(rowA.cells[2].innerText);
                cellB = parseInt(rowB.cells[2].innerText);
                return cellA < cellB ? 1 : -1; // Highest quantity first

            default:
                return 0;
        }
    });

    const tbody = table.querySelector('tbody');
    tbody.innerHTML = '';
    rowsArray.forEach(row => tbody.appendChild(row));
});

// updated on Nov.11
// Total Sales Table
let currentPage = 1;
const rowsPerPage = 15;

// Update Sales Table Function with Pagination
function updateSalesTable(filteredSalesData = null) {
    const salesData = JSON.parse(localStorage.getItem('totalSales')) || [];
    const salesTableBody = document.getElementById('salesTable').querySelector('tbody');
    const totalSalesAmountElem = document.getElementById('totalSalesAmount');
    salesTableBody.innerHTML = '';
    let totalAmount = 0;

    const displayData = filteredSalesData || salesData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Calculate total sales amount across all sales data
    totalAmount = displayData.reduce((acc, sale) => {
        return acc + (parseFloat(sale.total.replace(/[^0-9.-]+/g, "")) || 0);
    }, 0);
    
    // Calculate total pages
    const totalPages = Math.ceil(displayData.length / rowsPerPage);
    
    // Get the current page's data
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentPageData = displayData.slice(startIndex, endIndex);

    currentPageData.forEach(sale => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sale.program}</td>
            <td>${sale.layout}</td>
            <td>${sale.quantity}</td>
            <td>${sale.timestamp}</td>
            <td>${sale.total}</td>
        `;
        salesTableBody.appendChild(row);
    });


    // Update total sales amount displayed (fixed)
    totalSalesAmountElem.textContent = `₱${totalAmount.toFixed(2)}`;
    updatePaginationControls(totalPages);
}

// Update Pagination Controls
function updatePaginationControls(totalPages) {
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');

    // Update page info to show "Page X of Y"
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages || totalPages === 0; // Disable if last page
}

// Handle Previous Page
document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        updateSalesTable();
    }
});

// Handle Next Page
document.getElementById('nextPage').addEventListener('click', () => {
    const salesData = JSON.parse(localStorage.getItem('totalSales')) || [];
    const totalPages = Math.ceil(salesData.length / rowsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        updateSalesTable();
    }
});

// updated on NOV.12
// Function to filter sales by selected date
function filterSalesByDate() {
    const selectedDate = new Date(document.getElementById('salesDateFilter').value);
    currentPage = 1; // Reset to first page

    if (!selectedDate) return updateSalesTable();

    const salesData = JSON.parse(localStorage.getItem('totalSales')) || [];
    const filteredSales = salesData.filter(sale => {
        const saleDate = new Date(sale.timestamp).toLocaleDateString();
        const selectedDateOnly = selectedDate.toLocaleDateString();
        return saleDate === selectedDateOnly;
    });

    updateSalesTable(filteredSales);
}

// Event Listener for Date Filter
document.getElementById('salesDateFilter').addEventListener('change', filterSalesByDate);

// Initialize Table on Page Load
document.addEventListener('DOMContentLoaded', () => updateSalesTable());



// Function to create the Sales by Product Chart
function createSalesByProductChart() {
    const salesData = JSON.parse(localStorage.getItem('totalSales')) || [];

    // Calculate total quantities of Lined and Unlined layouts
    const linedSales = salesData
        .filter(sale => sale.layout === 'Lined')
        .reduce((acc, sale) => acc + parseInt(sale.quantity), 0);
    const unlinedSales = salesData
        .filter(sale => sale.layout === 'Unlined')
        .reduce((acc, sale) => acc + parseInt(sale.quantity), 0);

    const ctx = document.getElementById('salesByProductChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Lined Layout', 'Unlined Layout'],
            datasets: [{
                label: 'Number of Sales',
                data: [linedSales, unlinedSales],
                backgroundColor: ['388E3C', '#2196F3'], // Colors for each bar
                borderColor: ['#388E3C', '#1976D2'], // Border colors for each bar
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true // Ensure the y-axis starts at zero
                }
            }
        }
    });
}

// Call functions to update the sales table and create the chart on page load
document.addEventListener('DOMContentLoaded', createSalesByProductChart);


// Mapping of full program names to abbreviations
const programAbbreviations = {
    "Faculty of Engineering": "FoE",
    "Faculty of Hospitality and Tourism Management": "FHTM",
    "Faculty of Computer Studies and Information Technology": "FCSIT",
    "Faculty of Criminal Justice": "FCJ",
    "Faculty of Teacher Education": "FTE",
    "Faculty of Technology": "FoT"
};

// Sales by Faculty Chart
function createSalesByFacultyChart() {
    const salesData = JSON.parse(localStorage.getItem('totalSales')) || [];
    const facultyCounts = {};
    const facultyTotals = {};

    salesData.forEach(sale => {
        // Get the abbreviation for the program
        const programAbbr = programAbbreviations[sale.program] || sale.program;

        if (!facultyCounts[programAbbr]) {
            facultyCounts[programAbbr] = 0;
            facultyTotals[programAbbr] = 0;
        }
        facultyCounts[programAbbr] += parseInt(sale.quantity); // Total sales quantity per program
        facultyTotals[programAbbr] += parseFloat(sale.total.replace('php', ''));  // Total amount of sales per program
    });

    const ctx = document.getElementById('salesByFacultyChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(facultyCounts),  // Program abbreviations
            datasets: [{
                label: 'Number of Sales',
                data: Object.values(facultyCounts),  // Sales quantities per program
                backgroundColor: '#FF9800',
                borderColor: '#F57C00',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Create Chart
document.addEventListener('DOMContentLoaded', () => {
    createSalesByFacultyChart(); // Create the sales by faculty chart
});


// Function to clear all sales data
function clearSalesData() {
    // Clear data from local storage
    localStorage.removeItem('totalSales');
    
    // Clear the sales table
    updateSalesTable(); // This will empty the table as it sets innerHTML to ''

    // Clear the Sales by Product chart
    const ctxProduct = document.getElementById('salesByProductChart').getContext('2d');
    ctxProduct.clearRect(0, 0, ctxProduct.canvas.width, ctxProduct.canvas.height);
    
    // Clear the Sales by Faculty chart
    const ctxFaculty = document.getElementById('salesByFacultyChart').getContext('2d');
    ctxFaculty.clearRect(0, 0, ctxFaculty.canvas.width, ctxFaculty.canvas.height);
}

// Attach event listener to clear data button
document.getElementById('clearDataButton').addEventListener('click', clearSalesData);