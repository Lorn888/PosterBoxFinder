const URL = "./model/";  // model folder path
let model, webcam, labelContainer, maxPredictions;

// Poster → Box mapping
const boxMap = {
    "1": "Box 1",
    "2": "Box 2",
    "3": "Box 3"
};

// Load the model and setup webcam
async function init() {
    model = await tmImage.load(URL + "model.json", URL + "metadata.json");
    maxPredictions = model.getTotalClasses();

    const webcamElement = document.getElementById("webcam");
    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            webcamElement.srcObject = stream;
            setInterval(predict, 1000); // predict every second
        });
}

// Run prediction
async function predict() {
    const webcamElement = document.getElementById("webcam");
    const prediction = await model.predict(webcamElement);
    prediction.sort((a, b) => b.probability - a.probability);
    const best = prediction[0];

    let boxInfo = boxMap[best.className] || "Unknown";
    document.getElementById("result").innerText =
        `${best.className} → ${boxInfo} (${(best.probability * 100).toFixed(1)}%)`;
}

init();