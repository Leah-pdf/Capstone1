//**DOM SELECTORS*/

const startButton = document.querySelector(".js-start-button");
const statusSpan = document.querySelector(".js-status"); // Selects the status element
const heading = document.querySelector(".js-heading"); // Selects the heading element
const padContainer = document.querySelector(".js-pad-container"); // Selects the pad container

/**
* VARIABLES
*/
let computerSequence = []; // Track the computer-generated sequence
let playerSequence = []; // Track the player-generated sequence
let maxRoundCount = 0; // Max number of rounds (varies with level)
let roundCount = 0; // Track current round

/**
* Pads configuration
*/
const pads = [
 { color: "red", selector: document.querySelector(".js-pad-red"), sound: new Audio("../assets/simon-says-sound-1.mp3") },
 { color: "green", selector: document.querySelector(".js-pad-green"), sound: new Audio("../assets/simon-says-sound-2.mp3") },
 { color: "blue", selector: document.querySelector(".js-pad-blue"), sound: new Audio("../assets/simon-says-sound-3.mp3") },
 { color: "yellow", selector: document.querySelector(".js-pad-yellow"), sound: new Audio("../assets/simon-says-sound-4.mp3") }
];

/**EVENT LISTENERS*/

startButton.addEventListener("click", startButtonHandler); // Start button event listener
padContainer.addEventListener("click", padHandler); // Pads click event listener

/**EVENT HANDLERS*/


function startButtonHandler() {
 roundCount = 1;
 computerSequence = [];
 playerSequence = [];
 
 startButton.classList.add("hidden"); // Hide start button
 statusSpan.classList.remove("hidden"); // Show status message
 
 setLevel(1); // Default to level 1
 playComputerTurn(); // Start the game!
}

/**
* Called when one of the pads is clicked.
*/
function padHandler(event) {
 const { color } = event.target.dataset;
 if (!color) return;

 const pad = pads.find(pad => pad.color === color);
 pad.sound.play();
 checkPress(color); // Check if the press is correct
}

/**
* HELPER FUNCTIONS
*/

// Set difficulty level
function setLevel(level = 1) {
 const levelMap = { 1: 8, 2: 14, 3: 20, 4: 31 };
 maxRoundCount = levelMap[level] || 8; // Default to 8 rounds
 setText(heading, `Level ${level} - Round 1 of ${maxRoundCount}`);
}

// Get a random item from an array
function getRandomItem(collection) {
 return collection[Math.floor(Math.random() * collection.length)];
}

//  Set text of an element
function setText(element, text) {
 element.textContent = text;
}

//  Light up a pad and play its sound
function activatePad(color) {
 const pad = pads.find(pad => pad.color === color);
 if (!pad) return;

 pad.selector.classList.add("activated");
 pad.sound.play();

 setTimeout(() => pad.selector.classList.remove("activated"), 500);
}

// Activate a sequence of pads
function activatePads(sequence) {
 sequence.forEach((color, index) => {
   setTimeout(() => activatePad(color), (index + 1) * 1000);
 });
}

// Computer plays its turn
function playComputerTurn() {
 padContainer.classList.add("unclickable"); // Prevent user clicks
 setText(statusSpan, "The captain's turn...");
 setText(heading, `Waves ${waveCount} of ${maxWaveCount}`);

 computerSequence.push(getRandomItem(pads).color);
 activatePads(computerSequence);

 setTimeout(playHumanTurn, waveCount * 600 + 1000);
}

// Player's turn to copy the sequence
function playHumanTurn() {
 padContainer.classList.remove("unclickable");
 setText(statusSpan, `Your turn: ${computerSequence.length - playerSequence.length} presses left`);
}

// Check if player clicked the correct sequence
function checkPress(color) {
 playerSequence.push(color);
 const index = playerSequence.length - 1;

 if (computerSequence[index] !== playerSequence[index]) {
   resetGame("Oops! Wrong move. Try again!");
   return;
 }

 if (playerSequence.length === computerSequence.length) {
   checkRound();
 } else {
   setText(statusSpan, `Your turn: ${computerSequence.length - playerSequence.length} presses left`);
 }
}

// Check if the round is complete
function checkRound() {
 if (roundCount === maxRoundCount) {
   resetGame("🎉 You won! Well done! 🎉");
 } else {
   roundCount++;
   playerSequence = [];
   setText(statusSpan, "Nice! Keep going!");
   setTimeout(playComputerTurn, 1000);
 }
}

// Reset the game
function resetGame(message) {
 alert(message);
 computerSequence = [];
 playerSequence = [];
 roundCount = 0;

 setText(heading, "Simon Says");
 startButton.classList.remove("hidden");
 statusSpan.classList.add("hidden");
 padContainer.classList.add("unclickable");
}

/**
* Exposing functions for testing
*/
window.statusSpan = statusSpan;
window.heading = heading;
window.padContainer = padContainer;
window.pads = pads;
window.computerSequence = computerSequence;
window.playerSequence = playerSequence;
window.maxRoundCount = maxRoundCount;
window.roundCount = roundCount;
window.startButtonHandler = startButtonHandler;
window.padHandler = padHandler;
window.setLevel = setLevel;
window.getRandomItem = getRandomItem;
window.setText = setText;
window.activatePad = activatePad;
window.activatePads = activatePads;
window.playComputerTurn = playComputerTurn;
window.playHumanTurn = playHumanTurn;
window.checkPress = checkPress;
window.checkRound = checkRound;
window.resetGame = resetGame;
