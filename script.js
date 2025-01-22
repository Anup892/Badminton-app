document.addEventListener('DOMContentLoaded', () => {
    // DOM References
    const bdy = document.querySelector(".main");
    const player1name = document.querySelector("#play1");
    const player2name = document.querySelector("#play2");
    const points1 = document.querySelector("#pts1");
    const points2 = document.querySelector("#pts2");
    const player1 = document.querySelector(".points1");
    const player2 = document.querySelector(".points2");
    const total1 = document.querySelector("#total1");
    const total2 = document.querySelector("#total2");
    const selectSets = document.querySelector("#sets");
    const editName = document.querySelectorAll("#edit i");
    const speechSelect = document.getElementById('voiceSelect');

    // Function to handle point changes and announcing the score
    function handlePlayerClick(player, opponent, pointsElement, totalElement) {
        const winPoint = parseInt(document.querySelector("#points").value);
        
        // Increment the player's score
        let currentScore = parseInt(pointsElement.innerText);
        pointsElement.innerText = currentScore + 1;

        // Check if both players are one point away from winning, adjust winPoint
        if (parseInt(points1.innerText) === winPoint - 1 && parseInt(points2.innerText) === winPoint - 1) {
            winPoint++; // Increase win point threshold if both players are at one point away
        }

        // Highlight the player who is about to win
        if (parseInt(pointsElement.innerText) === winPoint - 1) {
            pointsElement.style.color = "red";
        }

        // Check if the current player has won the set
        if (parseInt(pointsElement.innerText) === winPoint) {
            let total = parseInt(totalElement.innerText);
            totalElement.innerText = total + 1;  // Increment total sets won

            // Only show "end set" dialog if the match is not over
            if (!isMatchOver()) {
                newSetDialog();  // Trigger new set dialog
            }

            checkSetCompletion();  // Check if the set is complete
        }

        // Construct speech text based on scores
        const score1Text = getScoreText(parseInt(points1.innerText));
        const score2Text = getScoreText(parseInt(points2.innerText));
        let speechText = '';

        if (score1Text === score2Text) {
            speechText = `${score1Text}, all`;
        } else if (parseInt(points1.innerText) > parseInt(points2.innerText)) {
            speechText = `${score1Text}, ${score2Text}`;
        } else {
            speechText = `${score2Text}, ${score1Text}`;
        }

        // Select voice and initiate speech
        const selectedVoice = speechSynthesis.getVoices()[speechSelect.selectedIndex];
        const speech = new SpeechSynthesisUtterance(speechText);
        speech.voice = selectedVoice;  // Set the selected voice
        speech.pitch = 1;  // Pitch of the speech
        speech.rate = 1.5;  // Rate of the speech
        speechSynthesis.speak(speech);
    }

    // Function to convert score of 0 to "love"
    function getScoreText(score) {
        return score === 0 ? "love" : score;
    }

    // Add event listeners for player score updates
    if (player1 && player2) {
        player1.addEventListener("click", () => {
            speechSynthesis.cancel();  // Cancel any ongoing speech
            handlePlayerClick(player1, player2, points1, total1);
        });

        player2.addEventListener("click", () => {
            speechSynthesis.cancel();  // Cancel any ongoing speech
            handlePlayerClick(player2, player1, points2, total2);
        });
    }

    // Score dialog box (set end)
    function newSetDialog() {
        // Check if the match is over before showing the dialog
        if (isMatchOver()) return;  // Skip the dialog if the match is already over

        const newGameBox = createDialogBox("Do you want to end this set?", () => {
            points1.innerText = points2.innerText = "0";
            points1.style.color = points2.style.color = "white";
            speechSynthesis.cancel();  // Cancel any ongoing speech
        });
        bdy.appendChild(newGameBox);
    }

    // Check if the set is complete and if a player has won enough sets to end the match
    function checkSetCompletion() {
        const setsToWin = parseInt(selectSets.value);
        const totalSets = parseInt(total1.innerText) + parseInt(total2.innerText);
        const total1Wins = parseInt(total1.innerText);
        const total2Wins = parseInt(total2.innerText);

        // Check if either player has won the required number of sets
        if (totalSets === setsToWin) {
            endMatch();  // End the match if a player wins enough sets
        }
    }

    // Check if the match is over
    function isMatchOver() {
        const setsToWin = parseInt(selectSets.value);
        return parseInt(total1.innerText) >= setsToWin || parseInt(total2.innerText) >= setsToWin;
    }

    // End the match and reset everything
    function endMatch() {
        const overGameBox = createDialogBox(`Match Over! Do you want to restart?`, () => {
            // Reload the page to restart the game
            location.reload(); 
        });
        bdy.appendChild(overGameBox);
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
            onOkClick();  // Call the provided callback (which will reload the page)
            dialogBox.remove();  // Remove the dialog after confirmation
        });
    
        cancel.addEventListener("click", () => dialogBox.remove());  // Close the dialog if cancel is clicked
        
        return dialogBox;
    }
    

    // Handle player names editing
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

    // Populate voices for speech synthesis
    function populateVoiceList() {
        const voiceSelect = speechSelect;
        const voices = speechSynthesis.getVoices();
        voiceSelect.innerHTML = ''; // Clear existing options

        voices.forEach((voice, index) => {
            const option = document.createElement('option');
            option.textContent = voice.name + ' (' + voice.lang + ')';
            option.value = index;
            voiceSelect.appendChild(option);
        });
    }

    speechSynthesis.onvoiceschanged = populateVoiceList;
    populateVoiceList();  // Populate voices on page load

    //for decrement if needed
const decre1 = document.querySelector(".decre1");
const decre2 = document.querySelector(".decre2");

decre1.addEventListener("click",()=>{
    if(points1.innerText==0){
        alert("You cannot decrease form 0")
    }else{
        points1.innerText = parseInt(points1.innerText) - 1;
    }
})
decre2.addEventListener("click",()=>{
    if(points2.innerText==0){
        alert("You cannot decrease form 0")
    }else{
        points2.innerText = parseInt(points2.innerText) - 1;
    }
})

});
