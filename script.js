const URL = "./model/";  // model folder path
let model, webcamElement, maxPredictions;

// Poster → Box mapping
const boxMap = {
    "1": "Box 1",
    "2": "Box 2",
    "3": "Box 3"
};

webcamElement = document.getElementById("webcam");
const startButton = document.getElementById("startButton");

startButton.addEventListener("click", async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        webcamElement.srcObject = stream;
        startButton.style.display = "none"; // hide button after starting
        await initModel();
    } catch(err) {
        console.error("Camera access denied", err);
        alert("Camera access is required to use this app.");
    }
});

// Load Teachable Machine model
async function initModel() {
    model = await tmImage.load(URL + "model.json", URL + "metadata.json");
    maxPredictions = model.getTotalClasses();
    setInterval(predict, 1000); // run prediction every second
}

// Run prediction
async function predict() {
    const prediction = await model.predict(webcamElement);
    prediction.sort((a, b) => b.probability - a.probability);
    const best = prediction[0];

    let boxInfo = boxMap[best.className] || "Unknown";
    document.getElementById("result").innerText =
        `${best.className} → ${boxInfo} (${(best.probability * 100).toFixed(1)}%)`;
}