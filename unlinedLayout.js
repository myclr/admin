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

document.querySelectorAll('.sidebar a').forEach(link => {
    link.addEventListener('click', function() {
        // Remove 'active' class from all links
        document.querySelectorAll('.sidebar a').forEach(link => link.classList.remove('active'));
        // Add 'active' class to the clicked link
        this.classList.add('active');
    });
});