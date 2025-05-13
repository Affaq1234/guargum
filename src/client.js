import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-database.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBgzRisv5h1DU-pHf2AFlXOxFuAXOXMtcA",
  authDomain: "test123-7d539.firebaseapp.com",
  databaseURL: "https://test123-7d539-default-rtdb.firebaseio.com",
  projectId: "test123-7d539",
  storageBucket: "test123-7d539.appspot.com",
  messagingSenderId: "419338836985",
  appId: "1:419338836985:web:0e224b673b965a85c3fb28"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Form submission handler
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector(".formA");
  
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    try {
      const formData = {
        fullname: form.fullname.value,
        address: form.address.value,
        email: form.email.value,
        subject: form.subject.value,
        message: form.message.value,
        timestamp: new Date().toISOString()
      };

      // Create reference to database
      const submissionsRef = ref(database, 'submissions/' + Date.now());
      
      // Save to Firebase
      await set(submissionsRef, formData);
      
      alert("Form submitted successfully!");
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form. Please check console for details.");
    }
  });
});