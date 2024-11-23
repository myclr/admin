// updated as of NOV.6
// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

// Firebase configuration for the admin-login project
const firebaseConfig = {
    apiKey: "AIzaSyDqxo3IrnvOX2_9c2fv96iDeq1c8X4AE94",
    authDomain: "fir-v10-15166.firebaseapp.com",
    databaseURL: "https://fir-v10-15166-default-rtdb.firebaseio.com",
    projectId: "fir-v10-15166",
    storageBucket: "fir-v10-15166.appspot.com",
    messagingSenderId: "199033930521",
    appId: "1:199033930521:web:48501e8ea61ff8c5413b88"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Function to handle user sign-in
export async function signInUser(email, password) {
    try {
        // Attempt to sign in the user with Firebase Authentication
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        // Save the admin email to localStorage after successful login
        localStorage.setItem('adminEmail', userCredential.user.email);

        // Successful login
        console.log("Login successful, redirecting to dashboard...");
        window.location.href = "dashboard.html"; // Redirect to dashboard

    } catch (error) {
        console.error("Error during sign-in:", error.code, error.message);

        // Display a user-friendly error message
        let errorMessage;
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            errorMessage = "Invalid email or password. Please try again.";
        } else if (error.code === 'auth/too-many-requests') {
            errorMessage = "Too many unsuccessful login attempts. Please try again later.";
        } else {
            errorMessage = "Login failed. Please check your credentials.";
        }

        document.getElementById('loginError').textContent = errorMessage;
    }
}

// Event listener for login button
document.getElementById('loginButton').addEventListener('click', function(event) {
    event.preventDefault();
    const email = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    signInUser(email, password); // Call the login function
});