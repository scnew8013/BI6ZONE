const API_KEY = "AIzaSyD3u5xSsP_IetpsQR70rJJ96rQB6Z4dMfU"; // Your Gemini API Key

async function processInput() {
    const question = document.getElementById("questionInput").value;
    const imageInput = document.getElementById("imageInput").files[0];

    if (!question && !imageInput) {
        alert("Please enter a question or upload an image.");
        return;
    }

    let requestBody = {
        prompt: question,
        model: "gemini-pro",
    };

    if (imageInput) {
        const base64Image = await convertToBase64(imageInput);
        requestBody.image = base64Image; // Gemini supports image inputs in base64
    }

    document.getElementById("responseText").innerText = "Generating response...";

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateText?key=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();
        document.getElementById("responseText").innerText = data.candidates?.[0]?.output || "No response from AI.";
    } catch (error) {
        document.getElementById("responseText").innerText = "Error: Unable to get response.";
    }
}

function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = (error) => reject(error);
    });
}
