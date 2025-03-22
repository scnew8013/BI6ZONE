const API_KEY = "AIzaSyD3u5xSsP_IetpsQR70rJJ96rQB6Z4dMfU";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const fileInput = document.getElementById("file-input");
const fileNameDisplay = document.getElementById("file-name");
const questionInput = document.getElementById("question-input");
const getAnswerBtn = document.getElementById("get-answer-btn");
const responseDiv = document.getElementById("response");

document.getElementById("choose-file-btn").addEventListener("click", () => {
    fileInput.click();
});

// Display selected file name
fileInput.addEventListener("change", () => {
    fileNameDisplay.textContent = fileInput.files.length ? `Selected: ${fileInput.files[0].name}` : "";
});

// Function to send question to Gemini API
const fetchAnswer = async (question, fileData = null) => {
    try {
        const body = {
            contents: [{ role: "user", parts: [{ text: question }] }]
        };

        if (fileData) {
            body.contents[0].parts.push({ inline_data: { data: fileData } });
        }

        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI.";
    } catch (error) {
        return `Error: ${error.message}`;
    }
};

// Handle the "Get Answer" button click
getAnswerBtn.addEventListener("click", async () => {
    const question = questionInput.value.trim();
    if (!question && !fileInput.files.length) {
        responseDiv.innerHTML = "Please enter a question or upload a file.";
        return;
    }

    responseDiv.innerHTML = "Generating answer...";

    let fileData = null;
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        fileData = await new Promise(resolve => {
            reader.onload = () => resolve(reader.result.split(",")[1]); // Get base64 data
        });
    }

    const answer = await fetchAnswer(question, fileData);
    responseDiv.innerHTML = answer;
});
