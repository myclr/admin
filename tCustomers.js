// Top Customer
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

//okay na until last part sa code
// Function to fetch total sales data from localStorage
function getSalesData() {
    return JSON.parse(localStorage.getItem('totalSales')) || [];
}

// Function to create the sales by product chart (combined Lined and Unlined sales per program)
function createSalesByProductChart() {
    const salesData = getSalesData();

    const programAbbreviations = {
        "Faculty of Engineering": "FoE",
        "Faculty of Hospitality and Tourism Management": "FHTM",
        "Faculty of Computer Studies and Information Technology": "FCSIT",
        "Faculty of Criminal Justice": "FCJ",
        "Faculty of Teacher Education": "FTE",
        "Faculty of Technology": "FoT"
    };

    const productCounts = {};

    // Aggregate the total quantities for each program, combining Lined and Unlined
    salesData.forEach(sale => {
        const programAbbr = programAbbreviations[sale.program] || sale.program;

        if (!productCounts[programAbbr]) {
            productCounts[programAbbr] = 0; // Initialize total count for the program
        }

        productCounts[programAbbr] += parseInt(sale.quantity); // Add quantity for both Lined and Unlined
    });

    const programs = Object.keys(productCounts);
    const quantities = Object.values(productCounts);

    const ctx = document.getElementById('productSalesChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: programs, // Programs only, no Lined/Unlined distinction
            datasets: [{
                label: 'Total Quantity Purchased (Lined & Unlined)',
                data: quantities,
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


// Function to calculate and display the program with the highest purchases (Top Customer)
function updateTopCustomer() {
    const salesData = getSalesData();
    const programCounts = {};
    const priceMapping = {
        1: 4,
        2: 7,
        3: 11,
        4: 14,
        5: 18,
        6: 21,
        7: 25,
        8: 28,
        9: 32,
        10: 35
    };

    // Aggregate the total quantities for each program
    salesData.forEach(sale => {
        if (!programCounts[sale.program]) {
            programCounts[sale.program] = { totalQuantity: 0, totalSales: 0 };
        }
        const quantity = parseInt(sale.quantity);
        programCounts[sale.program].totalQuantity += quantity; // Sum quantities purchased per program
        programCounts[sale.program].totalSales += priceMapping[quantity] || 0; // Calculate total sales using price mapping
    });

    // Determine the maximum quantity purchased
    let maxQuantity = 0;

    for (const program in programCounts) {
        if (programCounts[program].totalQuantity > maxQuantity) {
            maxQuantity = programCounts[program].totalQuantity;
        }
    }

    // Collect all programs with the maximum quantity
    const topPrograms = [];
    let totalSalesForOneTopProgram = 0; // To store total sales from one of the top programs

    for (const program in programCounts) {
        if (programCounts[program].totalQuantity === maxQuantity) {
            topPrograms.push(program);
            // Take the total sales from the first matching top program
            totalSalesForOneTopProgram = programCounts[program].totalSales; 
        }
    }

    // Display the top programs, their quantities, and total sales
    const topProgramNameElement = document.getElementById('topProgramName');
    const topProgramQtyElement = document.getElementById('topProgramQty');
    const topProgramSalesElement = document.getElementById('topProgramTotalSales');

    topProgramNameElement.textContent = topPrograms.length > 0 ? topPrograms.join(', ') : 'N/A';  // If no top program, display 'N/A'
    topProgramQtyElement.textContent = maxQuantity || 0;
    topProgramSalesElement.textContent = `${totalSalesForOneTopProgram.toFixed(2)}`; // Display total sales with 2 decimal points
}

// Call the functions when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    createSalesByProductChart(); // Create the product sales chart
    updateTopCustomer(); // Update the top customer information
});
