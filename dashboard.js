// Dashboard
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

// email updated on NOV.6
// Get the admin email from localStorage
const adminEmail = localStorage.getItem('adminEmail') || 'admin@example.com';

// Display the admin email in the placeholder element
document.getElementById('adminEmail').textContent = adminEmail;


document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('salesChart').getContext('2d');

    // okay na
    // Fetch and display lined layout stock from localStorage
    const linedStock = localStorage.getItem('linedStockCount') || 0; // Default to 0 if not found
    document.getElementById('linedStock').textContent = linedStock;

    // Fetch and display unlined layout stock from localStorage
    const unlinedStock = localStorage.getItem('unlinedStockCount') || 0; // Default to 0 if not found
    document.getElementById('unlinedStock').textContent = unlinedStock;
});



// okay na
// Function to calculate and display the top programs with the highest purchases
function updateTopCustomer() {
    const salesData = JSON.parse(localStorage.getItem('totalSales')) || [];
    
    if (salesData.length === 0) {
        // If no sales data is found, set placeholders
        document.getElementById('top-department').innerText = 'N/A';
        document.getElementById('top-purchases').innerText = '0';
        return;
    }

    const programPurchases = {};

    // Loop through sales data to calculate total purchases for each program
    salesData.forEach(sale => {
        const program = sale.program;
        const quantity = parseInt(sale.quantity);

        // Increment the program's total purchases
        if (!programPurchases[program]) {
            programPurchases[program] = 0;
        }
        programPurchases[program] += quantity;
    });

    // Find the highest total purchases
    let highestPurchases = 0;

    Object.values(programPurchases).forEach(purchases => {
        if (purchases > highestPurchases) {
            highestPurchases = purchases;
        }
    });

    // Collect all programs with the highest purchases
    const topPrograms = Object.keys(programPurchases).filter(program => programPurchases[program] === highestPurchases);

    // Update the HTML to display all top programs and their total purchases
    document.getElementById('top-department').innerText = topPrograms.join(', ') || 'N/A';  // Join programs by comma
    document.getElementById('top-purchases').innerText = highestPurchases || 0;
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', updateTopCustomer);



// okay na
// Function to create Total Sales Bar Graph
function createTotalSalesChart() {
    const salesData = JSON.parse(localStorage.getItem('totalSales')) || [];
    console.log('Sales Data:', salesData); // Debugging: Check if sales data is retrieved correctly

    const programAbbreviations = {
        "Faculty of Engineering": "FoE",
        "Faculty of Hospitality and Tourism Management": "FHTM",
        "Faculty of Computer Studies and Information Technology": "FCSIT",
        "Faculty of Criminal Justice": "FCJ",
        "Faculty of Teacher Education": "FTE",
        "Faculty of Technology": "FoT"
    };

    const totalSalesPerProgram = {};

    salesData.forEach(sale => {
        const programAbbr = programAbbreviations[sale.program] || sale.program;
        const totalSalePhp = parseFloat(sale.total.replace(/[^0-9.-]+/g, '')); // Remove 'PHP' and any other non-numeric characters

        if (!totalSalesPerProgram[programAbbr]) {
            totalSalesPerProgram[programAbbr] = 0;
        }

        totalSalesPerProgram[programAbbr] += totalSalePhp;
    });

    const programs = Object.keys(totalSalesPerProgram);
    const totalSales = Object.values(totalSalesPerProgram);

    const ctx = document.getElementById('salesChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: programs,
            datasets: [{
                label: 'Total Sales (PHP)',
                data: totalSales,
                backgroundColor: '#FFA726',
                borderColor: '#FB8C00',
                borderWidth: 2
            }]
        },
        options: {
            plugins: {
                legend: {
                    labels: {
                        color: '#FFFFFF',
                        font: {
                            size: 14
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#FFFFFF',
                        font: {
                            size: 12
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#FFFFFF',
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    }
                }
            }
        }
    });
}

// Call function to create the chart on page load
document.addEventListener('DOMContentLoaded', () => {
    createTotalSalesChart();
}); 