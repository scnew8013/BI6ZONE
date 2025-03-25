let memory = 0;
let history = [];
let functions = {};

function appendToDisplay(value) {
    document.getElementById("display").value += value;
}

function clearDisplay() {
    document.getElementById("display").value = '';
}

function calculateResult() {
    const display = document.getElementById("display");
    try {
        const result = eval(display.value);
        display.value = result;
        addToHistory(display.value);
    } catch (error) {
        display.value = "Error";
    }
}

function storeMemory() {
    const displayValue = parseFloat(document.getElementById("display").value);
    if (!isNaN(displayValue)) {
        memory += displayValue;
        alert("Stored in memory: " + memory);
    }
}

function recallMemory() {
    document.getElementById("display").value = memory;
}

function clearMemory() {
    memory = 0;
    alert("Memory cleared");
}

function graphFunction() {
    const displayValue = document.getElementById("display").value;

    const xValues = [];
    const yValues = [];

    for (let x = -10; x <= 10; x += 0.1) {
        xValues.push(x);
        try {
            const y = eval(displayValue.replace(/x/g, x));
            yValues.push(y);
        } catch (error) {
            alert("Error in graphing function");
            return;
        }
    }

    const trace = {
        x: xValues,
        y: yValues,
        mode: 'lines',
        type: 'scatter'
    };

    const data = [trace];

    const layout = {
        title: 'Graph of ' + displayValue,
        xaxis: { title: 'X-axis' },
        yaxis: { title: 'Y-axis' },
        autosize: true,
    };

    Plotly.newPlot('graph', data, layout);
}

function convertUnits() {
    const value = prompt("Enter value with unit (e.g., 10m, 5kg):");
    if (!value) return;

    const unitConversions = {
        "m": { "cm": 100, "km": 0.001, "in": 39.3701 },
        "kg": { "g": 1000, "lb": 2.20462, "oz": 35.274 },
        // Add more unit conversions as needed
    };

    const regex = /(\d+)([a-zA-Z]+)/;
    const match = value.match(regex);
    if (match) {
        const numValue = parseFloat(match[1]);
        const unit = match[2];
        const conversions = unitConversions[unit];

        if (conversions) {
            const conversionResults = [];
            for (const [key, factor] of Object.entries(conversions)) {
                conversionResults.push(`${numValue * factor} ${key}`);
            }
            alert(`Conversions: ${conversionResults.join(', ')}`);
        } else {
            alert("Unit not recognized.");
        }
    } else {
        alert("Invalid input.");
    }
}

function addToHistory(entry) {
    history.push(entry);
    const historyDiv = document.getElementById("history");
    historyDiv.innerHTML += `<div>${entry}</div>`;
}

function showHistory() {
    const historyDiv = document.getElementById("history");
    historyDiv.style.display = historyDiv.style.display === "none" ? "block" : "none";
}

function performStatCalc() {
    const numbers = prompt("Enter numbers separated by commas:");
    const numArray = numbers.split(',').map(Number);
    const mean = numArray.reduce((a, b) => a + b) / numArray.length;
    const variance = numArray.reduce((a, b) => a + (b - mean) ** 2) / numArray.length;
    const stdDev = Math.sqrt(variance);
    
    alert(`Mean: ${mean}, Standard Deviation: ${stdDev}`);
}

function performMatrixCalc() {
    const rows = prompt("Enter number of rows:");
    const cols = prompt("Enter number of columns:");
    const matrix = [];

    for (let i = 0; i < rows; i++) {
        const row = prompt(`Enter row ${i + 1} values separated by commas:`).split(',').map(Number);
        matrix.push(row);
    }

    alert(`Matrix:\n${matrix.map(row => row.join('\t')).join('\n')}`);
}

function solveEquation() {
    const equation = prompt("Enter a linear equation in the form 'ax + b = c':");
    const [left, right] = equation.split('=');
    const leftTerms = left.split('+').map(term => term.trim());
    const rightTerm = parseFloat(right.trim());

    let a = 0, b = 0;

    leftTerms.forEach(term => {
        if (term.includes('x')) {
            a += parseFloat(term.replace('x', '')) || 1;
        } else {
            b += parseFloat(term);
        }
    });

    const result = (rightTerm - b) / a;
    alert(`Solution: x = ${result}`);
}

function defineFunction() {
    const funcName = prompt("Enter the function name (e.g., f):");
    const funcBody = prompt("Enter the function body (e.g., x => x * x):");
    functions[funcName] = funcBody;
    alert(`Function ${funcName} defined.`);
}
