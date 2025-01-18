// DOM References
const bdy = document.querySelector(".main");
const btn = document.querySelector("#add");
const lists = document.querySelectorAll(".nav a");
const topic = document.querySelector("#topic");
const editName = document.querySelectorAll("#edit i");
const player1name = document.querySelector("#play1");
const player2name = document.querySelector("#play2");
const points1 = document.querySelector("#pts1");
const points2 = document.querySelector("#pts2");
const player1 = document.querySelector(".points1");
const player2 = document.querySelector(".points2");

const decre1 = document.querySelector(".decre1 i");
const decre2 = document.querySelector(".decre2 i");

const total1 = document.querySelector("#total1");
const total2 = document.querySelector("#total2");

const start = document.querySelector("#start");
const stop = document.querySelector("#stop");
const audio = new Audio('bgsong.mp3');

const selectSets = document.querySelector("#sets");

// New set dialog box
function newSetDialog() {
    const newGameBox = createDialogBox("Do you want to end this set?", () => {
        points1.innerText = points2.innerText = "0";
        points1.style.color = points2.style.color = "white";
        speechSynthesis.cancel();
    });
    bdy.appendChild(newGameBox);
}

// Match end dialog box
function overGameDialog() {
    const overGameBox = createDialogBoxover("Do you want to end this Match?", () => {
        points1.innerText = points2.innerText = "0";
        total1.innerText = total2.innerText = "0";
        points1.style.color = points2.style.color = "white";
        speechSynthesis.cancel();
        window.location.reload();
    });
    bdy.appendChild(overGameBox);
}

function createDialogBoxover(message, onOkClick) {
    const dialogBox = document.createElement("div");
    dialogBox.classList.add("Newgame");
    dialogBox.innerHTML = `
        <h4>${message}</h4>
        <div class='choose'>
            <button id='cancel'>Cancel</button>
            <button id='ok'>Ok</button>
        </div>
    `;
    
    const cancel = dialogBox.querySelector("#cancel");
    const ok = dialogBox.querySelector("#ok");
    
    ok.addEventListener("click", () => window.location.reload());
    cancel.addEventListener("click", () => dialogBox.remove());
    
    return dialogBox;
}

// Utility function to create a dialog box
function createDialogBox(message, onOkClick) {
    const dialogBox = document.createElement("div");
    dialogBox.classList.add("Newgame");
    dialogBox.innerHTML = `
        <h4>${message}</h4>
        <div class='choose'>
            <button id='cancel'>Cancel</button>
            <button id='ok'>Ok</button>
        </div>
    `;
    
    const cancel = dialogBox.querySelector("#cancel");
    const ok = dialogBox.querySelector("#ok");
    
    ok.addEventListener("click", () => {
        dialogBox.remove();
        points2.innerText = "0";
        points1.innerText = "0";
        points1.style.color = "white";
        points2.style.color = "white";
    });
    cancel.addEventListener("click", () => dialogBox.remove());
    
    return dialogBox;
}

// Check if the set is complete
function checkSetCompletion() {
    const setsToWin = parseInt(selectSets.value);
    const totalSets = parseInt(total1.innerText) + parseInt(total2.innerText);
    if (totalSets === setsToWin) {
        overGameDialog();  // Show match end dialog
    }
}

// Start background music
start.addEventListener("click", () => {
    if (audio.paused) {
        audio.volume = 0.1;
        audio.loop = true;
        audio.play();
    }
});

// Stop background music
stop.addEventListener("click", () => audio.pause());

// Edit player names
editName.forEach((name) => {
    name.addEventListener("click", () => {
        const editDiv = document.createElement("div");
        editDiv.classList.add("edit");
        bdy.appendChild(editDiv);
        editDiv.innerHTML = `
            <form>
                <input type="text" id="nameInput1" placeholder="Enter player 1 name.." required>
                <input type="text" id="nameInput2" placeholder="Enter player 2 name.." required>
                <button id="added">Add</button>
            </form>
        `;
        
        const added = editDiv.querySelector("#added");
        const nameInput1 = editDiv.querySelector("#nameInput1");
        const nameInput2 = editDiv.querySelector("#nameInput2");

        added.addEventListener("click", (e) => {
            e.preventDefault();
            if (!nameInput1.value || !nameInput2.value) {
                alert("Please fill both fields.");
            } else {
                player1name.innerText = nameInput1.value;
                player2name.innerText = nameInput2.value;
                editDiv.remove();
            }
        });
    });
});

// Score to text conversion
function getScoreText(score) {
    return score === 0 ? "love" : score;
}

// Ensure that the speech synthesis is only triggered when required and not too frequently.
let voices = [];

// Function to populate voices for speech synthesis
function populateVoiceList() {
    voices = speechSynthesis.getVoices();
    const voiceSelect = document.getElementById('voiceSelect');
    voiceSelect.innerHTML = ''; // Clear existing options

    voices.forEach((voice, index) => {
        const option = document.createElement('option');
        option.textContent = voice.name + ' (' + voice.lang + ')';
        option.value = index;
        voiceSelect.appendChild(option);
    });
}

speechSynthesis.onvoiceschanged = populateVoiceList;
populateVoiceList(); // Populate voices on page load

// Handle player point changes
function handlePlayerClick(player, opponent, pointsElement, totalElement) {
    const winPoint = parseInt(document.querySelector("#points").value);  // Win point threshold (e.g., 5)

    // Increment the player's score
    let currentScore = parseInt(pointsElement.innerText);
    pointsElement.innerText = currentScore + 1;

    // Check if both players are one point away from winning, adjust winPoint
    if (parseInt(player1.innerText) === winPoint - 1 && parseInt(player2.innerText) === winPoint - 1) {
        winPoint++; // Increase win point threshold if both players are at one point away
    }

    // Highlight the player who is about to win
    if (parseInt(pointsElement.innerText) === winPoint - 1) {
        pointsElement.style.color = "red"; // Color the player red when one point away
    }

    // Check if the current player has won the set
    if (parseInt(pointsElement.innerText) === winPoint) {
        let total = parseInt(totalElement.innerText);
        totalElement.innerText = total + 1;  // Increment total sets won
        newSetDialog();  // Trigger new set dialog
        checkSetCompletion();  // Check if the set is complete
    }

    // Get score texts to announce the score using speech synthesis
    const score1Text = getScoreText(parseInt(player1.innerText));
    const score2Text = getScoreText(parseInt(player2.innerText));

    // Construct speech text based on scores
    let speechText = '';
    if (score1Text === score2Text) {
        speechText = `${score1Text}, all`;
    } else if (parseInt(player1.innerText) > parseInt(player2.innerText)) {
        speechText = `${score1Text}, ${score2Text}`;
    } else {
        speechText = `${score2Text}, ${score1Text}`;
    }

    // Select voice and initiate speech
    const selectedVoice = voices[document.getElementById('voiceSelect').value];
    const speech = new SpeechSynthesisUtterance(speechText);
    speech.voice = selectedVoice;  // Set the selected voice
    speech.pitch = 1;  // Pitch of the speech
    speech.rate = 1.5;  // Rate of the speech
    speechSynthesis.speak(speech);
}

// Player 1 Click Event
player1.addEventListener("click", () => {
    speechSynthesis.cancel()
    handlePlayerClick(player1, player2, points1, total1);
});

// Player 2 Click Event
player2.addEventListener("click", () => {
    speechSynthesis.cancel()
    handlePlayerClick(player2, player1, points2, total2);
});

// Decrease points functionality
decre1.addEventListener("click", () => {
    if (points1.innerText > 0) {
        points1.innerText--;
    } else {
        alert("Score can't go below 0.");
    }
});

decre2.addEventListener("click", () => {
    if (points2.innerText > 0) {
        points2.innerText--;
    } else {
        alert("Score can't go below 0.");
    }
});

// Add match button to create new match form
btn.addEventListener("click", () => {
    const maindiv = document.createElement("div");
    maindiv.classList.add("form-Div");
    bdy.appendChild(maindiv);

    const del = document.createElement("button");
    del.classList.add("delete");
    del.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    maindiv.appendChild(del);
    del.addEventListener("click", () => maindiv.remove());
});
