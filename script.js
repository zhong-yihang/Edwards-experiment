let currentTrial = 1;
const totalTrials = 12;
let targetBagType = "";

const introPage = document.getElementById("intro-page");
const trialPage = document.getElementById("trial-page");
const endPage = document.getElementById("end-page");
const trialNumEl = document.getElementById("trial-num");
const chipColorEl = document.getElementById("chip-color");
const slider = document.getElementById("estimate-slider");
const valueDisplay = document.getElementById("estimate-value");
const startBtn = document.getElementById("start-btn");
const submitBtn = document.getElementById("submit-trial");

slider.addEventListener("input", () => {
    valueDisplay.textContent = slider.value;
});

startBtn.addEventListener("click", () => {
    if(Math.random() >= 0.5){
        targetBagType = "70% Red Bag";
    }else{
        targetBagType = "70% Blue Bag";
    }
    introPage.classList.add("hidden");
    trialPage.classList.remove("hidden");
    drawNewChip();
});

submitBtn.addEventListener("click", () => {
    currentTrial++;
    if(currentTrial > totalTrials){
        trialPage.classList.add("hidden");
        endPage.classList.remove("hidden");
        console.log("True selected bag of this participant:", targetBagType);
        return;
    }
    trialNumEl.textContent = currentTrial;
    slider.value = 50;
    valueDisplay.textContent = 50;
    drawNewChip();
});

function drawNewChip(){
    const randomNum = Math.random();
    if(targetBagType === "70% Red Bag"){
        chipColorEl = randomNum < 0.7 ? "Red" : "Blue";
    }else{
        chipColorEl.textContent = randomNum < 0.3 ? "Red" : "Blue";
    }
}