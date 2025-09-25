// Path to the Teachable Machine model folder
const URL = "./model/";
let model, webcamElement, maxPredictions;

// Map your Teachable Machine labels to boxes
// Make sure these keys exactly match the labels in your metadata.json
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
    const constraints = {
        video: {
            facingMode: { exact: "environment" }, // try rear camera
            width: { ideal: 1280 },
            height: { ideal: 720 }
        }
    };

    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        webcamElement.srcObject = stream;
        webcamElement.onloadeddata = async () => {
            startButton.style.display = "none"; // hide button
            await loadModel();
        };
    } catch(err) {
        console.warn("Rear camera not available, falling back to default camera:", err);
        try {
            const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true });
            webcamElement.srcObject = fallbackStream;
            webcamElement.onloadeddata = async () => {
                startButton.style.display = "none";
                await loadModel();
            };
        } catch(fallbackErr) {
            console.error("Camera access failed:", fallbackErr);
            alert("Camera access is required to use this app.");
        }
    }
});

// Load Teachable Machine model
async function loadModel() {
    try {
        model = await tmImage.load(URL + "model.json", URL + "metadata.json");
        maxPredictions = model.getTotalClasses();
        console.log("✅ Model loaded successfully!"); // debug line
        resultElement.innerText = "Model loaded! Point at a poster...";
        setInterval(predict, 1000); // predict every second
    } catch(err) {
        console.error("Failed to load model:", err);
        resultElement.innerText = "Failed to load model. See console.";
        alert("Failed to load the model. Check console for details.");
    }
}

// Run prediction
async function predict() {
    try {
        const prediction = await model.predict(webcamElement);
        prediction.sort((a, b) => b.probability - a.probability);
        const best = prediction[0];

        const boxInfo = boxMap[best.className] || "Unknown";
        resultElement.innerText = `${best.className} → ${boxInfo} (${(best.probability * 100).toFixed(1)}%)`;
    } catch(err) {
        console.error("Prediction error:", err);
    }
}
