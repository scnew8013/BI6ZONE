const API_KEY = "AIzaSyD3u5xSsP_IetpsQR70rJJ96rQB6Z4dMfU";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const fileInput = document.getElementById("file-input");
const questionInput = document.getElementById("question-input");
const submitBtn = document.getElementById("submit-btn");
const responseOutput = document.getElementById("response-output");
const fileNameDisplay = document.querySelector(".file-name");

let uploadedFile = null;

fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) {
        fileNameDisplay.textContent = `Selected: ${file.name}`;
        uploadedFile = file;
    } else {
        fileNameDisplay.textContent = "";
        uploadedFile = null;
    }
});

submitBtn.addEventListener("click", async () => {
    const question = questionInput.value.trim();
    if (!question && !uploadedFile) {
        responseOutput.textContent = "Please enter a question or upload an image.";
        return;
    }

    responseOutput.textContent = "Generating response...";

    let fileData = null;
    if (uploadedFile) {
        fileData = await encodeFileToBase64(uploadedFile);
    }

    const requestBody = {
        contents: [
            { role: "user", parts: [{ text: question }] }
        ]
    };

    if (fileData) {
        requestBody.contents[0].parts.push({
            inline_data: { mime_type: uploadedFile.type, data: fileData }
        });
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error.message);

        const aiResponse = data.candidates[0].content.parts[0].text.trim();
        responseOutput.textContent = aiResponse || "No response from AI.";
    } catch (error) {
        responseOutput.textContent = "Error: " + error.message;
    }
});

async function encodeFileToBase64(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.readAsDataURL(file);
    });
}
