// Path to the Teachable Machine model folder
const URL = "./model/";  
let model, webcamElement, maxPredictions;

// Map your Teachable Machine labels to boxes
const boxMap = {
    "1": "Box 1",
    "2": "Box 2",
    "3": "Box 3"
};

// Get DOM elements
webcamElement = document.getElementById("webcam");
const startButton = document.getElementById("startButton");
const resultElement = document.getElementById("result");

// Start camera when button is clicked
startButton.addEventListener("click", async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: "environment" } // rear camera
        });
        webcamElement.srcObject = stream;

        // Wait until the video is loaded
        webcamElement.onloadeddata = async () => {
            startButton.style.display = "none"; // hide button
            await loadModel(); // load the model and start predictions
        };
    } catch(err) {
        console.error("Camera access denied or failed:", err);
        alert("Camera access is required to use this app.");
    }
});

// Load Teachable Machine model
async function loadModel() {
    try {
        model = await tmImage.load(URL + "model.json", URL + "metadata.json");
        maxPredictions = model.getTotalClasses();
        setInterval(predict, 1000); // predict every second
    } catch(err) {
        console.error("Failed to load model:", err);
        alert("Failed to load the model. Check console for details.");
    }
}

// Run prediction
async function predict() {
    try {
        const prediction = await model.predict(webcamElement);
        prediction.sort((a, b) => b.probability - a.probability);
        const best = prediction[0];

        let boxInfo = boxMap[best.className] || "Unknown";
        resultElement.innerText = `${best.className} → ${boxInfo} (${(best.probability*100).toFixed(1)}%)`;
    } catch(err) {
        console.error("Prediction error:", err);
    }
}