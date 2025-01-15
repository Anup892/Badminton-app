let bdy = document.querySelector(".main");
let btn = document.querySelector("#add");
let lists = document.querySelectorAll(".nav a");
let topic = document.querySelector("#topic");
let editName = document.querySelectorAll("#edit i");
let player1name = document.querySelector("#play1");
let player2name = document.querySelector("#play2");
let points1 = document.querySelector("#pts1");
let points2 = document.querySelector("#pts2");
let player1 = document.querySelector(".player1");
let player2 = document.querySelector(".player2");

let decre1 = document.querySelector(".decre1 i");
let decre2 = document.querySelector(".decre2 i");

let total1 = document.querySelector("#total1");
let total2 = document.querySelector("#total2")

let start = document.querySelector("#start");
let stop = document.querySelector("#stop");
let audio = new Audio('bgsong.mp3');

let selectSets = document.querySelector("#sets");

    // function for new set

function newset(){
    let NewGameBox = document.createElement("div");
    NewGameBox.classList.add("Newgame");
    bdy.appendChild(NewGameBox);
    NewGameBox.innerHTML=" <h4>Do you want to end this set ?</h4>  <div class='choose'><button id='cancel'>Cancel<button><button id='ok'>Ok</button> </div>"


    let cancel = document.querySelector("#cancel");
    let okay = document.querySelector("#ok");
    
    okay.addEventListener("click",()=>{
        points1.innerText="0";
        points2.innerText="0";
        points1.style.color="white";
        points2.style.color="white"
        NewGameBox.remove();
        speechSynthesis.cancel(); 
    })
    cancel.addEventListener("click",()=>{
        player1.style.pointerEvents = "none";
        NewGameBox.remove();
    })
    
}

//function if sets is over

function overgame() {
    let newSetbox = document.querySelector(".Newgame");
    newSetbox.remove();
    let OvergameBox = document.createElement("div");
    OvergameBox.classList.add("Newgame");
    bdy.appendChild(OvergameBox);
    OvergameBox.innerHTML = "<h4>Do you want to end this Match?</h4>" +
                            "<div class='choose'>" +
                            "<button id='cancel'>Cancel</button>" +
                            "<button id='ok'>Ok</button>" +
                            "</div>";

    // Select the buttons after the HTML content has been added
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
        window.location.reload();
    });

    // Add event listener for the 'Cancel' button
    cancel.addEventListener("click", () => {
        OvergameBox.remove();  // Just remove the confirmation box if 'Cancel' is clicked
    });
}



function toCheckIfSetIsComplete(){
    if(parseInt(total1.innerText) + parseInt(total2.innerText)  == selectSets.value){
        overgame();
    }
}


start.addEventListener("click",()=>{

    // Set audio properties (optional)
    audio.volume = 0.1; // Set volume (between 0.0 and 1.0)
    audio.loop = true;  // Set to loop the audio

    // Play the audio
    audio.play();


})
stop.addEventListener("click",()=>{
audio.pause();

})
editName.forEach(name => {
    name.disabled = true;  
    name.addEventListener("click", () => {
        let editdiv = document.createElement("div");
        editdiv.classList.add("edit");
        bdy.appendChild(editdiv);

        editdiv.innerHTML = ' <form><input type="text" id="nameInput1" placeholder="Enter a player 1 name.."  required><input type="text" id="nameInput2" placeholder="Enter a player 2 name.." required><button id="added">Add</button> </form>';

        let added = document.querySelector("#added");
        let nameInput1 = document.querySelector("#nameInput1"); 
        let nameInput2 = document.querySelector("#nameInput2"); 
        added.addEventListener("click", () => {
        if (nameInput1.value==""||nameInput2.value=="") {
                alert("Please fill the above field..")
        } else {
            addThis(nameInput1,nameInput2, editdiv);  
        }
        });
    });
});

// Function to update the selected player's name and remove the edit div
function addThis(nameInput1,nameInput2, editdiv) {
    // Remove the editdiv after updating
    editdiv.remove();  

    // Get the value from the input field
    let nameaayo1 = nameInput1.value;  
    let nameaayo2 = nameInput2.value;  
    player1name.innerText=nameaayo1;
    player2name.innerText=nameaayo2;
}




let voices = [];
        
// Function to populate available voices in the dropdown
function populateVoiceList() {
    voices = speechSynthesis.getVoices();
    const voiceSelect = document.getElementById('voiceSelect');
    voiceSelect.innerHTML = '';  // Clear existing options

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



// Player 1 Event Listener
player1.addEventListener("click", () => {
    let points = document.querySelector("#points")
const win = { winpnt: parseInt(points.value)}


    let valueOfSets = selectSets.value;
    speechSynthesis.cancel();
    let pnt1 = parseInt(points1.innerText);
    points1.innerText = pnt1 + 1;

    // Check if both players are one point away from winning
    if (parseInt(player1.innerText) === win.winpnt - 1 && parseInt(player2.innerText) === win.winpnt - 1) {
        win.winpnt = win.winpnt + 1;  // Increase win points by 1
    }

    // Check if player1 has reached the winning point
    if (parseInt(points1.innerText) === win.winpnt - 1) {
        points1.style.color = "red";  // Highlight the player when they are about to win
    }

    if (parseInt(points1.innerText) === win.winpnt) {
        let total = parseInt(total1.innerText);
        total1.innerText = total + 1;  // Increase total sets won by player1
        newset();  // Start a new set
        toCheckIfSetIsComplete();  // Check if the set is complete
    }

    // Check if player2 has reached the winning point
    if (parseInt(points2.innerText) === win.winpnt) {
        newset();  // Start a new set
        let total = parseInt(total2.innerText);
        total2.innerText = total + 1;  // Increase total sets won by player2
        toCheckIfSetIsComplete();  // Check if the set is complete
    }
    // Get the score texts, converting 0 to "love"
    let score1Text = getScoreText(pnt1 + 1);
    let score2Text = getScoreText(parseInt(points2.innerText));
    if (points1.innerText === points2.innerText) {
        const selectedVoice = voices[document.getElementById('voiceSelect').value];
        let speech1 = new SpeechSynthesisUtterance(`${score1Text}, "all"`);
        speech1.voice = selectedVoice;  // Use the selected voice
        speech1.pitch = 1;  // Pitch (0 to 2)
        speech1.rate = 1.5;   // Rate (0.1 to 10)
    
        // Start speaking the score
        speechSynthesis.speak(speech1);
    } else if (points1.innerText > points2.innerText) {
        const selectedVoice = voices[document.getElementById('voiceSelect').value];
        let speech1 = new SpeechSynthesisUtterance(`${score1Text}, ${score2Text}`);
        speech1.voice = selectedVoice;  // Use the selected voice
        speech1.pitch = 1;  // Pitch (0 to 2)
        speech1.rate = 1.5;   // Rate (0.1 to 10)
    
        // Start speaking the point getter who scored first (points1 first)
        speechSynthesis.speak(speech1);
    } else if (points1.innerText < points2.innerText) {
        const selectedVoice = voices[document.getElementById('voiceSelect').value];
        let speech1 = new SpeechSynthesisUtterance(`${score2Text}, ${score1Text}`);
        speech1.voice = selectedVoice;  // Use the selected voice
        speech1.pitch = 1;  // Pitch (0 to 2)
        speech1.rate = 1.5;   // Rate (0.1 to 10)
    
        speechSynthesis.speak(speech1);
    }
    
    
});

// Player 2 Event Listener
player2.addEventListener("click", () => {
    let points = document.querySelector("#points")
const win = { winpnt: parseInt(points.value)}

    speechSynthesis.cancel();
    let pnt2 = parseInt(points2.innerText);
    points2.innerText = pnt2 + 1;

    // Check if both players are one point away from winning
    if (parseInt(player1.innerText) === win.winpnt - 1 && parseInt(player2.innerText) === win.winpnt - 1) {
        win.winpnt = win.winpnt + 1;  // Increase win points by 1
    }

    // Check if player2 has reached the winning point
    if (parseInt(points2.innerText) === win.winpnt - 1) {
        points2.style.color = "red";  // Highlight the player when they are about to win
    }

    if (parseInt(points2.innerText) === win.winpnt) {
        newset();  // Start a new set
        let total = parseInt(total2.innerText);
        total2.innerText = total + 1;  // Increase total sets won by player2
        toCheckIfSetIsComplete();  // Check if the set is complete
    }

    // Check if player1 has reached the winning point
    if (parseInt(points1.innerText) === win.winpnt) {
        newset();  // Start a new set
        let total = parseInt(total1.innerText);
        total1.innerText = total + 1;  // Increase total sets won by player1
        toCheckIfSetIsComplete();  // Check if the set is complete
    }

    // Get the score texts, converting 0 to "love"
    let score1Text = getScoreText(parseInt(points1.innerText));
    let score2Text = getScoreText(pnt2 + 1);

    if (points2.innerText === points1.innerText) {
        const selectedVoice = voices[document.getElementById('voiceSelect').value];
        let speech = new SpeechSynthesisUtterance(`${score1Text}, "all"`);
        speech.voice = selectedVoice;  // Use the selected voice
        speech.pitch = 1;  // Pitch (0 to 2)
        speech.rate = 1.5;  // Rate (0.1 to 10)
    
        // Start speaking the score
        speechSynthesis.speak(speech);
    } else if (points1.innerText > points2.innerText) {
        const selectedVoice = voices[document.getElementById('voiceSelect').value];
        let speech1 = new SpeechSynthesisUtterance(`${score1Text}, ${score2Text}`);
        speech1.voice = selectedVoice;  // Use the selected voice
        speech1.pitch = 1;  // Pitch (0 to 2)
        speech1.rate = 1.5;  // Rate (0.1 to 10)
    
        // Start speaking the score with points1 first
        speechSynthesis.speak(speech1);
    } else if (points1.innerText < points2.innerText) {
        const selectedVoice = voices[document.getElementById('voiceSelect').value];
        let speech1 = new SpeechSynthesisUtterance(`${score2Text}, ${score1Text}`);
        speech1.voice = selectedVoice;  // Use the selected voice
        speech1.pitch = 1;  // Pitch (0 to 2)
        speech1.rate = 1.5;  // Rate (0.1 to 10)
    
        // Start speaking the score with points2 first
        speechSynthesis.speak(speech1);
    }
    
});


//for point decrement

decre1.addEventListener("click",()=>{
    if(points1.innerText==0){
        alert("jpt kam nagara bhai...")
    }else{
        let currentpnt = parseInt(points1.innerText) ;
        points1.innerText= currentpnt - 1;
    }
    

})

decre2.addEventListener("click",()=>{
    if(points2.innerText==0){
        alert("jpt kam nagara bhai...")
    }else{
        let currentpnt = parseInt(points2.innerText) ;
        points2.innerText= currentpnt - 1;
    }
    

})

lists.forEach(list => {
    list.addEventListener("click", () => {
        lists.forEach(item => {
            item.style.borderBottom = ""; 
        });

        list.style.borderBottom = "2px solid white";
        let text = list.innerText;
        topic.innerText=text;

    });
});


btn.addEventListener("click",()=>{
    addMatch();
})

function addMatch(){
    let maindiv = document.createElement("div");
    maindiv.classList.add("form-Div");
    bdy.appendChild(maindiv);
    let del= document.createElement("button");
    del.classList.add("delete");
    del.innerHTML= '<i class="fa-solid fa-xmark"></i>'; 
    maindiv.appendChild(del);
    del.addEventListener("click",()=>{
        deleteMatch(maindiv);
    })
}

function deleteMatch(maindiv){
maindiv.remove();
}