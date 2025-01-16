// DOM Elements
let bdy = document.querySelector(".main");
let btn = document.querySelector("#add");
let lists = document.querySelectorAll(".nav a");
let topic = document.querySelector("#topic");
let editName = document.querySelectorAll("#edit i");
let player1name = document.querySelector("#play1");
let player2name = document.querySelector("#play2");
let points1 = document.querySelector("#pts1");
let points2 = document.querySelector("#pts2");
let player1 = document.querySelector(".points1");
let player2 = document.querySelector(".points2");
let decre1 = document.querySelector(".decre1 i");
let decre2 = document.querySelector(".decre2 i");
let total1 = document.querySelector("#total1");
let total2 = document.querySelector("#total2");
let start = document.querySelector("#start");
let stop = document.querySelector("#stop");
let audio = new Audio('bgsong.mp3');
let selectSets = document.querySelector("#sets");

// Function to start a new set
function newSet() {
    let NewGameBox = document.createElement("div");
    NewGameBox.classList.add("Newgame");
    bdy.appendChild(NewGameBox);
    NewGameBox.innerHTML = `
        <h4>Do you want to end this set?</h4>
        <div class='choose'>
            <button id='cancel'>Cancel</button>
            <button id='ok'>Ok</button>
        </div>`;

    let cancel = NewGameBox.querySelector("#cancel");
    let okay = NewGameBox.querySelector("#ok");

    okay.addEventListener("click", () => {
        points1.innerText = "0";
        points2.innerText = "0";
        points1.style.color = "white";
        points2.style.color = "white";
        NewGameBox.remove();
        speechSynthesis.cancel();
    });

    cancel.addEventListener("click", () => {
        player1.style.pointerEvents = "none";
        NewGameBox.remove();
    });
}

// Function to check if a set is complete
function toCheckIfSetIsComplete() {
    if (parseInt(total1.innerText) + parseInt(total2.innerText) === parseInt(selectSets.value)) {
        overGame();
    }
}

// Function to handle end of the game
function overGame() {
    let OvergameBox = document.createElement("div");
    OvergameBox.classList.add("Newgame");
    bdy.appendChild(OvergameBox);
    OvergameBox.innerHTML = `
        <h4>Do you want to end this Match?</h4>
        <div class='choose'>
            <button id='cancel'>Cancel</button>
            <button id='ok'>Ok</button>
        </div>`;

    let cancel = OvergameBox.querySelector("#cancel");
    let okay = OvergameBox.querySelector("#ok");

    okay.addEventListener("click", () => {
        points1.innerText = "0";
        points2.innerText = "0";
        points1.style.color = "white";
        points2.style.color = "white";
        total1.innerText = "0";
        total2.innerText = "0";
        OvergameBox.remove();
        window.location.reload();
    });

    cancel.addEventListener("click", () => {
        OvergameBox.remove();
    });
}

// Start button logic for audio
start.addEventListener("click", () => {
    audio.volume = 0.1;
    audio.loop = true;
    audio.play();
});

// Stop button logic for audio
stop.addEventListener("click", () => {
    audio.pause();
});

// Edit player names
editName.forEach(name => {
    name.disabled = true;
    name.addEventListener("click", () => {
        let editdiv = document.createElement("div");
        editdiv.classList.add("edit");
        bdy.appendChild(editdiv);
        editdiv.innerHTML = `
            <form>
                <input type="text" id="nameInput1" placeholder="Enter player 1 name.." required>
                <input type="text" id="nameInput2" placeholder="Enter player 2 name.." required>
                <button id="added">Add</button>
            </form>`;
        
        let added = document.querySelector("#added");
        let nameInput1 = document.querySelector("#nameInput1");
        let nameInput2 = document.querySelector("#nameInput2");

        added.addEventListener("click", (e) => {
            e.preventDefault();  // Prevent form submission
            if (nameInput1.value === "" || nameInput2.value === "") {
                alert("Please fill in both fields");
            } else {
                addNames(nameInput1.value, nameInput2.value, editdiv);
            }
        });
    });
});

// Add names function
function addNames(name1, name2, editDiv) {
    player1name.innerText = name1;
    player2name.innerText = name2;
    editDiv.remove();  // Remove the edit form after adding names
}

// Points Update Logic (Player 1)
player1.addEventListener("click", () => {
    updatePoints(points1, points2, total1, total2, 1);
});

// Points Update Logic (Player 2)
player2.addEventListener("click", () => {
    updatePoints(points2, points1, total2, total1, 2);
});

// Generic function for updating points
function updatePoints(currentPlayerPoints, otherPlayerPoints, currentTotal, otherTotal, playerNumber) {
    let winPoints = parseInt(document.querySelector("#points").value);

    let currentPoints = parseInt(currentPlayerPoints.innerText);
    currentPlayerPoints.innerText = currentPoints + 1;

    // Check if player reaches win points
    if (currentPoints + 1 === winPoints) {
        currentPlayerPoints.style.color = "red";
    }

    // Update total sets
    if (parseInt(currentPlayerPoints.innerText) === winPoints) {
        let total = parseInt(currentTotal.innerText);
        currentTotal.innerText = total + 1;
        newSet();
        toCheckIfSetIsComplete();
    }

    // Handle the voice announcement
    announceScore(currentPlayerPoints, otherPlayerPoints);
}

// Function for voice announcement
function announceScore(currentPlayerPoints, otherPlayerPoints) {
    let score1 = getScoreText(parseInt(currentPlayerPoints.innerText));
    let score2 = getScoreText(parseInt(otherPlayerPoints.innerText));
    let selectedVoice = voices[document.getElementById('voiceSelect').value];
    let speech = new SpeechSynthesisUtterance(`${score1}, ${score2}`);
    speech.voice = selectedVoice;
    speech.pitch = 1;
    speech.rate = 1.5;
    speechSynthesis.speak(speech);
}

// Helper function to convert score 0 to "love"
function getScoreText(score) {
    return score === 0 ? "love" : score;
}

// Decrement points logic
decre1.addEventListener("click", () => {
    decrementPoints(points1);
});

decre2.addEventListener("click", () => {
    decrementPoints(points2);
});

// Generic function for decrementing points
function decrementPoints(playerPoints) {
    if (parseInt(playerPoints.innerText) > 0) {
        playerPoints.innerText = parseInt(playerPoints.innerText) - 1;
    } else {
        alert("Can't decrement below 0!");
    }
}

// Match Management (Add new match)
btn.addEventListener("click", () => {
    addMatch();
});

function addMatch() {
    let maindiv = document.createElement("div");
    maindiv.classList.add("form-Div");
    bdy.appendChild(maindiv);

    let del = document.createElement("button");
    del.classList.add("delete");
    del.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    maindiv.appendChild(del);

    del.addEventListener("click", () => {
        deleteMatch(maindiv);
    });
}

function deleteMatch(maindiv) {
    maindiv.remove();
}

// Change topic when a navigation item is clicked
lists.forEach(list => {
    list.addEventListener("click", () => {
        lists.forEach(item => {
            item.style.borderBottom = "";
        });
        list.style.borderBottom = "2px solid white";
        topic.innerText = list.innerText;
    });
});

// Function for populating voices dropdown
let voices = [];

function populateVoiceList() {
    voices = speechSynthesis.getVoices();
    const voiceSelect = document.getElementById('voiceSelect');
    voiceSelect.innerHTML = '';  // Clear existing options

    voices.forEach((voice, index) => {
        const option = document.createElement('option');
        option.textContent = `${voice.name} (${voice.lang})`;
        option.value = index;
        voiceSelect.appendChild(option);
    });
}

speechSynthesis.onvoiceschanged = populateVoiceList;
populateVoiceList();
