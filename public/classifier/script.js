const URL = "https://teachablemachine.withgoogle.com/models/Cfk9Ws6vQ/";
let model, webcam, labelContainer, maxPredictions;
let isRunning = false;

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    const flip = true;
    webcam = new tmImage.Webcam(200, 200, flip);
    await webcam.setup();
    await webcam.play();
    window.requestAnimationFrame(loop);

    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }

    // Get the button element
    const startButton = document.querySelector(".button");
    startButton.textContent = "Start";
    startButton.addEventListener("click", toggleClassification);
}

async function loop() {
    if (isRunning) {
        webcam.update();
        await predict();
    }
    window.requestAnimationFrame(loop);
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + (prediction[i].probability * 100).toFixed(2) + "%";
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }
}

function toggleClassification() {
    isRunning = !isRunning;
    const startButton = document.querySelector(".button");
    if (isRunning) {
        startButton.textContent = "Stop";
    } else {
        startButton.textContent = "Start";
    }
}
