let currentTrial = 1;
const totalTrials = 12;
let targetBagType = "";
let trialStartTime = 0;
let trialRecords = [];

const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbx7R3cf5t3U-jyri6N1ZHXXbZSTGPi8PQQHSOGFJIvKq_r9fjOzYcLTZBRDanCE4klV7A/exec";

function getParticipantId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("PROLIFIC_PID") || "unknown";
}
const participantID = getParticipantId();

const introPage = document.getElementById("intro-page");
const trialPage = document.getElementById("trial-page");
const endPage = document.getElementById("end-page");
const trialNumEl = document.getElementById("trial-num");
const chipCircleEl = document.getElementById("chip-circle");
const slider = document.getElementById("estimate-slider");
const valueDisplay = document.getElementById("estimate-value");
const startBtn = document.getElementById("start-btn");
const submitBtn = document.getElementById("submit-trial");
const statusText = document.getElementById("submit-status");

slider.addEventListener("input", () => {
    valueDisplay.textContent = slider.value;
});

startBtn.addEventListener("click", () => {
    targetBagType = Math.random() >= 0.5 ? "70% Red Bag" : "70% Blue Bag";
    introPage.classList.add("hidden");
    trialPage.classList.remove("hidden");
    drawNewChip();
});

submitBtn.addEventListener("click", () => {
    const reactionTime = Date.now() - trialStartTime;
    const estimateValue = parseInt(slider.value);
    const drawnColor = chipCircleEl.classList.contains("red") ? "Red" : "Blue";

    trialRecords.push({
        trial: currentTrial,
        drawnColor: drawnColor,
        estimate: estimateValue,
        reactionMs: reactionTime
    });

    currentTrial++;
    if(currentTrial > totalTrials){
        trialPage.classList.add("hidden");
        endPage.classList.remove("hidden");
        sendDataToSheet();
        return;
    }
    trialNumEl.textContent = currentTrial;
    slider.value = 50;
    valueDisplay.textContent = 50;
    drawNewChip();
});

function drawNewChip(){
    let chipColor;
    const randomNum = Math.random();
    if(targetBagType === "70% Red Bag"){
        chipColor = randomNum < 0.7 ? "Red" : "Blue";
    }else{
        chipColor = randomNum < 0.3 ? "Red" : "Blue";
    }
    chipCircleEl.classList.remove("draw-active","red","blue");

    setTimeout(() => {
        if(chipColor === "Red"){
            chipCircleEl.classList.add("red");
        }else{
            chipCircleEl.classList.add("blue");
        }
        chipCircleEl.classList.add("draw-active");
        trialStartTime = Date.now();
    }, 250);
}

async function sendDataToSheet(){
    statusText.textContent = "Submitting your data...";
    const payload = {
        participantId: participantID,
        targetBag: targetBagType,
        trialData: trialRecords
    };
    try{
        const fetchResult = await fetch(WEB_APP_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload)
        });
        if(fetchResult.ok){
            statusText.textContent = "Submission successful. Thank you!";
        }else{
            statusText.textContent = "Submission failed. Please refresh and retry.";
        }
    }catch(error){
        statusText.textContent = "Submission failed. Please refresh and retry.";
        console.error("Submit Error:", error);
    }
}