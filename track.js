// Firebase Config (Replace with your Firebase details)
const firebaseConfig = {
    apiKey: "AIzaSyAe5Rx6v9v7a_AbppRkEWs6tEkVd3DbyLI",
  authDomain: "bi6zone-51b18.firebaseapp.com",
  databaseURL: "https://bi6zone-51b18-default-rtdb.firebaseio.com",
  projectId: "bi6zone-51b18",
  storageBucket: "bi6zone-51b18.firebasestorage.app",
  messagingSenderId: "787996595081",
  appId: "1:787996595081:web:f85edbb0001124f2cf0758",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Function to track visitors
function trackVisitor() {
    const visitorRef = db.ref('visitors');

    // Increment the visitor count
    visitorRef.transaction(currentCount => (currentCount || 0) + 1);
}

// Call function when site is loaded
window.onload = trackVisitor;
