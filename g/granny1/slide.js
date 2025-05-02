$(function () {
    // Owl Carousel
    var owl = $("#owl-example1");
    owl.owlCarousel({

        margin: 10,
        loop: true,
        nav: true,
        dots: false,
        center: true,
        // autoplay: true,            // Enable autoplay
        // autoplayTimeout: 3000,     // Time between slides (in milliseconds)
        // autoplayHoverPause: false,  // Pause on hover
        navText: ["<img src='./IMG/prev1.png'>", "<img src='./IMG/n1.png'>"],
        responsive: {
            0: {
                items: 1 // For mobile devices
            },
            599: {
                items: 1,// For mobile devices (less than 600px)
                slideBy: 1 // For tablets
            },
            767: {
                items: 3,
                slideBy: 1 // For tablets
            },
            1499:{
                items: 3,
                slideBy: 1 // For tablets
            }
        },
    });

    var owl = $("#owl-example2");
    owl.owlCarousel({
        
        margin: 10,
        loop: true,
        nav: true,
        center: true,
        autoplay: true,            // Enable autoplay
        autoplayTimeout: 3000,     // Time between slides (in milliseconds)
        autoplayHoverPause: false,  // Pause on hover
        navText: ["<img src='./IMG/prev1.png'>", "<img src='./IMG/n1.png'>"],
        responsive: {
            0: {
                items: 1 // For mobile devices
            },
            599: {
                items: 1,// For mobile devices (less than 600px)
                slideBy: 1 // For tablets
            },
            767: {
                items: 3,
                slideBy: 1 // For tablets
            },
            1499:{
                items: 3,
                slideBy: 1 // For tablets
            }
        },
    });

    var owl = $("#owl-example3");
    owl.owlCarousel({
        items: 1, // Default number of items
        margin: 10,
        loop: false,
        nav: false,
        dots: true,
        // navText: ['<i class="fa-solid fa-circle"></i>', '<i class="fa-solid fa-circle"></i>'],
        responsive: {
            0: {
                items: 1 // For mobile devices
            },
            599: {
                items: 1,// For mobile devices (less than 600px)
                slideBy: 1 // For tablets
            },
            899: {
                items: 2,
                slideBy: 2 // For tablets
            },
            912: {
                items: 2,
                slideBy: 2 // For small desktops
            },
        
            1024:{
                items: 2,
                slideBy: 2 // For small desktops
            
            },
            1199: {
                items: 2,
                slideBy: 2 // For small desktops
            },
            1599: {
                items: 2,
                slideBy: 2 // For large desktops
            }
        },
        //navigation: true, // Uncomment if you want to enable navigation

    });
});

function togglePopup(popupId) {
    var popup = document.getElementById(popupId);
    if (popup.style.display === "none" || popup.style.display === "") {
        popup.style.display = "flex"; // Show the popup
    } else {
        popup.style.display = "none"; // Hide the popup
    }
}

function togglePassword() {
    let passwordInput = document.getElementById("loginPassword");
    let toggleIcon = document.getElementById("toggleEye");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleIcon.classList.remove("fa-eye");
        toggleIcon.classList.add("fa-eye-slash");
    } else {
        passwordInput.type = "password";
        toggleIcon.classList.remove("fa-eye-slash");
        toggleIcon.classList.add("fa-eye");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const langOptions = document.querySelectorAll(".lang-option"); // Language options
    const languageInput = document.getElementById("languageInput"); // Hidden input field for forms

    // Language mapping for value & URL
    const languageMap = {
        "en": { value: 1, url: "/granny-en" }, // English
        "de": { value: 2, url: "/granny-de" }, // German
        "fr": { value: 3, url: "/granny-fr" }  // French
    };

    // Get saved language or default to English
    let savedLang = localStorage.getItem("selectedLanguage");
    
    if (!savedLang) {
        savedLang = "en"; // Default to English if nothing is saved
        localStorage.setItem("selectedLanguage", savedLang); // Save the default language
    }

    // Set the language input field's value based on saved language
    const languageValue = languageMap[savedLang].value;
    languageInput.value = languageValue;

    // Load translations and apply the saved language
    fetch("translations.json")
        .then(response => response.json())
        .then(translations => {
            // Change language text based on savedLang
            changeLanguage(savedLang, translations);

            // Update URL without reloading
            updateURL(languageMap[savedLang].url);

            // Add event listeners for language options
            langOptions.forEach(option => {
                option.addEventListener("click", function (event) {
                    event.preventDefault();
                    const selectedLang = this.getAttribute("data-lang");

                    // Store the selected language in localStorage
                    localStorage.setItem("selectedLanguage", selectedLang);

                    // Update hidden input field value
                    languageInput.value = languageMap[selectedLang].value;

                    // Apply the selected language
                    changeLanguage(selectedLang, translations);

                    // Update URL without reloading the page
                    updateURL(languageMap[selectedLang].url);
                });
            });
        })
        .catch(error => {
            console.error("Error loading translations:", error);
        });

    // Function to update the text content of elements based on the selected language
    function changeLanguage(language, translations) {
        document.querySelectorAll("[data-key]").forEach(element => {
            const key = element.getAttribute("data-key");
            if (translations[language] && translations[language][key]) {
                element.textContent = translations[language][key];
            }
        });
    }

    // Function to update the URL without reloading the page
    function updateURL(newURL) {
        window.history.pushState(null, "", newURL);
    }
});




document.addEventListener("DOMContentLoaded", function () {
    const langOptions = document.querySelectorAll(".lang-option"); // Assuming these are the language options
    const languageInput1 = document.getElementById("languageInput1"); // Hidden input field for language

    // Language mapping for value & URL
    const languageMap = {
        "en": 1, // English
        "de": 2, // German
        "fr": 3  // French
    };

    // Get saved language or default to English
    let savedLang = localStorage.getItem("selectedLanguage") || "en";
    localStorage.setItem("selectedLanguage", savedLang); // Ensure it's saved

    // Set initial language value in the hidden input
    languageInput1.value = languageMap[savedLang];

    // Add event listener to update language on click
    langOptions.forEach(option => {
        option.addEventListener("click", function (event) {
            event.preventDefault();
            const selectedLang = this.getAttribute("data-lang");

            // Store language selection
            localStorage.setItem("selectedLanguage", selectedLang);

            // Update hidden input field value
            languageInput1.value = languageMap[selectedLang];
        });
    });
});

