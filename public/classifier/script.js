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

    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) {
      labelContainer.appendChild(document.createElement("div"));
    }

    const startButton = document.querySelector(".button");
    startButton.addEventListener("click", toggleClassification);

    startButton.textContent = "Start";
  } catch (error) {
    console.error("Failed to initialize the model or webcam:", error);
  }
}

async function loop() {
  if (isRunning) {
    try {
      webcam.update();
      await predict();
    } catch (error) {
      console.error("Error in loop:", error);
    }
    window.requestAnimationFrame(loop);
  }
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
  }
}

function toggleClassification() {
  isRunning = !isRunning;
  const startButton = document.querySelector(".button");
  if (isRunning) {
    startButton.textContent = "Stop";
    webcam.play();
    window.requestAnimationFrame(loop);
  } else {
    startButton.textContent = "Start";
    webcam.stop();
    clearPredictions();
  }
}

function clearPredictions() {
  for (let i = 0; i < maxPredictions; i++) {
    labelContainer.childNodes[i].innerHTML = "";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  init();
});

