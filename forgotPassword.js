import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

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

// Event listener for reset button
document.getElementById('resetButton').addEventListener('click', async () => {
    const email = document.getElementById('resetEmail').value;
    const messageDiv = document.getElementById('resetMessage');

    try {
        await sendPasswordResetEmail(auth, email);
        messageDiv.style.color = 'green';
        messageDiv.textContent = "Password reset link sent! Please check you email.";
    } catch (error) {
        messageDiv.style.color = 'red';
        if (error.code === 'auth/user-not-found') {
            messageDiv.textContent = "No account found with that email.";
        } else {
            messageDiv.textContent = "Error sending reset link. Please try again.";
        }
        console.error("Error sending password reset email:", error);
    }
});