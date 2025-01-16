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

// function for new set
function newset() {
    let NewGameBox = document.createElement("div");
    NewGameBox.classList.add("Newgame");
    bdy.appendChild(NewGameBox);
    NewGameBox.innerHTML = " <h4>Do you want to end this set ?</h4>  <div class='choose'><button id='cancel'>Cancel<button><button id='ok'>Ok</button> </div>";

    let cancel = document.querySelector("#cancel");
    let okay = document.querySelector("#ok");

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

// function if sets are over (match ends)
function overgame() {
    let newSetbox = document.querySelector(".Newgame");
    if (newSetbox) newSetbox.remove(); // Ensure the old "Newgame" box is removed first

    let OvergameBox = document.createElement("div");
    OvergameBox.classList.add("Newgame");
    bdy.appendChild(OvergameBox);
    OvergameBox.innerHTML = "<h4>Do you want to end this Match?</h4>" +
        "<div class='choose'>" +
        "<button id='cancel'>Cancel</button>" +
        "<button id='ok'>Ok</button>" +
        "</div>";

    let cancel = OvergameBox.querySelector("#cancel");
    let okay = OvergameBox.querySelector("#ok");

    okay.addEventListener("click", () => {
        points1.innerText = "0";
        points2.innerText = "0";
        points1.style.color = "white";
        points2.style.color = "white";
        speechSynthesis.cancel();
        total1.innerText = "0";
        total2.innerText = "0";
        OvergameBox.remove();
        window.location.reload(); // Reload the page to reset everything
    });

    cancel.addEventListener("click", () => {
        OvergameBox.remove(); // Just remove the confirmation box if 'Cancel' is clicked
    });
}

// Function to check if a set is complete
function toCheckIfSetIsComplete() {
    const setsToWin = parseInt(selectSets.value);
    if (parseInt(total1.innerText) + parseInt(total2.innerText) === setsToWin) {
        overgame(); // Trigger overGame when the total sets are complete
    }
}

start.addEventListener("click", () => {
    if (audio.paused) {
        // Set audio properties
        audio.volume = 0.1; // Set volume (between 0.0 and 1.0)
        audio.loop = true;  // Set to loop the audio
        audio.play(); // Play the audio
    }
});

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

        added.addEventListener("click", () => {
            e.preventDefault();  // Prevent form submission
            if (nameInput1.value == "" || nameInput2.value == "") {
                alert("Please fill the above field..");
            } else {
                addThis(nameInput1, nameInput2, editdiv);
            }
        });
    });
});


// Function to update the selected player's name and remove the edit div
function addNames(name1, name2, editDiv) {
    player1name.innerText = name1;
    player2name.innerText = name2;
    editDiv.remove();  // Remove the edit form after adding names
}


let voices = [];

// Function to populate available voices in the dropdown
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
populateVoiceList();

//player 1
// Function to convert a score of 0 to "love"
function getScoreText(score) {
    return score === 0 ? "love" : score;
}

// Generic function to handle both player events
function handlePlayerClick(player, opponent, pointsElement, totalElement, player1Score, player2Score) {
    let points = document.querySelector("#points");
    const win = { winpnt: parseInt(points.value) };

    speechSynthesis.cancel();

    // Increment points for the clicked player
    let currentPlayerScore = parseInt(pointsElement.innerText);
    pointsElement.innerText = currentPlayerScore + 1;

    // Check if both players are one point away from winning
    if (parseInt(player1Score.innerText) === win.winpnt - 1 && parseInt(player2Score.innerText) === win.winpnt - 1) {
        win.winpnt = win.winpnt + 1;  // Increase win points by 1
    }

    // Highlight the player when they are about to win
    if (parseInt(pointsElement.innerText) === win.winpnt - 1) {
        pointsElement.style.color = "red";
    }

    // Check if player has reached the winning point
    if (parseInt(pointsElement.innerText) === win.winpnt) {
        let total = parseInt(totalElement.innerText);
        totalElement.innerText = total + 1;  // Increase total sets won by the player
        newset();  // Start a new set
        toCheckIfSetIsComplete();  // Check if the set is complete
    }

    // Check if the opponent has reached the winning point
    if (parseInt(opponent.innerText) === win.winpnt) {
        newset();  // Start a new set
        let total = parseInt(opponent.totalElement.innerText);
        opponent.totalElement.innerText = total + 1;  // Increase total sets won by the opponent
        toCheckIfSetIsComplete();  // Check if the set is complete
    }

    // Get the score texts, converting 0 to "love"
    let score1Text = getScoreText(parseInt(player1Score.innerText));
    let score2Text = getScoreText(parseInt(player2Score.innerText));

    // Use speech synthesis to announce the scores
    let speechText = '';
    if (player1Score.innerText === player2Score.innerText) {
        speechText = `${score1Text}, all`;
    } else if (parseInt(player1Score.innerText) > parseInt(player2Score.innerText)) {
        speechText = `${score1Text}, ${score2Text}`;
    } else {
        speechText = `${score2Text}, ${score1Text}`;
    }

    const selectedVoice = voices[document.getElementById('voiceSelect').value];
    let speech = new SpeechSynthesisUtterance(speechText);
    speech.voice = selectedVoice;  // Use the selected voice
    speech.pitch = 1;  // Pitch (0 to 2)
    speech.rate = 1.5;  // Rate (0.1 to 10)
    speechSynthesis.speak(speech);
}

// Player 1 Event Listener
player1.addEventListener("click", () => {
    handlePlayerClick(player1, player2, points1, total1, points1, points2);
});

// Player 2 Event Listener
player2.addEventListener("click", () => {
    handlePlayerClick(player2, player1, points2, total2, points2, points1);
});


// for point decrement
decre1.addEventListener("click", () => {
    if (points1.innerText == 0) {
        alert("jpt kam nagara bhai...");
    } else {
        let currentpnt = parseInt(points1.innerText);
        points1.innerText = currentpnt - 1;
    }
});


decre2.addEventListener("click", () => {
    if (points2.innerText == 0) {
        alert("jpt kam nagara bhai...");
    } else {
        let currentpnt = parseInt(points2.innerText);
        points2.innerText = currentpnt - 1;
    }
});


// lists.forEach(list => {
//     list.addEventListener("click", () => {
//         lists.forEach(item => {
//             item.style.borderBottom = "";
//         });

//         list.style.borderBottom = "2px solid white";
//         let text = list.innerText;
//         topic.innerText = text;
//     });
// });


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
