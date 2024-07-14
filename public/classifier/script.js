const URL = "https://teachablemachine.withgoogle.com/models/Cfk9Ws6vQ/";
let model, webcam, labelContainer, maxPredictions;
let isRunning = false;

async function init() {
    try {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        const flip = true;
        webcam = new tmImage.Webcam(200, 200, flip);
        await webcam.setup();
        const webcamContainer = document.getElementById("webcam-container");
        if (!webcamContainer.hasChildNodes()) {
            webcamContainer.appendChild(webcam.canvas);
        }

        labelContainer = document.getElementById("label-container");
        labelContainer.innerHTML = '';
        for (let i = 0; i < maxPredictions; i++) {
            labelContainer.appendChild(document.createElement("div"));
        }

        const startButton = document.querySelector(".button");
        startButton.addEventListener("click", toggleClassification);
        startButton.textContent = "Start";
        
        console.log("Initialization complete");
    } catch (error) {
        console.error("Failed to initialize the model or webcam:", error);
    }
}

function toggleClassification() {
    if (!isRunning) {
        startClassification();
    } else {
        stopClassification();
    }
}

function startClassification() {
    isRunning = true;
    webcam.play();
    updateStatus("Running...");
    console.log("Classification started");
    requestAnimationFrame(classificationLoop);
}

function stopClassification() {
    isRunning = false;
    webcam.stop();
    updateStatus("Stopped");
    console.log("Classification stopped");
}

async function classificationLoop() {
    if (!isRunning) return;

    try {
        webcam.update();
        await predict();
    } catch (error) {
        console.error("Error in classification loop:", error);
    }

    console.log("Frame processed at", new Date().toISOString());
    requestAnimationFrame(classificationLoop);
}

async function predict() {
    try {
        const prediction = await model.predict(webcam.canvas);
        for (let i = 0; i < maxPredictions; i++) {
            const classPrediction =
                prediction[i].className + ": " + (prediction[i].probability * 100).toFixed(2) + "%";
            labelContainer.childNodes[i].innerHTML = classPrediction;
        }
    } catch (error) {
        console.error("Error in predict:", error);
        throw error;
    }
}

function updateStatus(message) {
    const startButton = document.querySelector(".button");
    const statusDisplay = document.getElementById("status-display");
    
    startButton.textContent = isRunning ? "Stop" : "Start";
    statusDisplay.textContent = message;
}

document.addEventListener("DOMContentLoaded", init);

