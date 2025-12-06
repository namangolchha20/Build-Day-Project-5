const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const startBtn = document.querySelector(".start");
const stopBtn = document.querySelector(".stop");
const saveBtn = document.querySelector(".save");
const transcriptArea = document.querySelector(".transcript");
const notesList = document.querySelector(".notes");
const statusText = document.querySelector(".status");

let recognition = null;
let isListening = false;

const notes_key = "SpeechNotes";
let notes = [];

loadNotesFromStorage();

if(!SpeechRecognition) {
    alert("Speech Recognition not supported in this browser. Kindly move towards Chrome.");
    startBtn.disabled = true;
    stopBtn.disabled = true;
}else {
    recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = true;
    recognition.interimResults = true;

}

function updateStatus() {
    if(isListening) {
        statusText.textContent = "Listening...";
        statusText.classList.add("listening");
    }else {
        statusText.textContent = "Not Listening";
        statusText.classList.remove("listening");
    }
}

startBtn.addEventListener('click', function() {
    if(!recognition) {
        console.log("Speech not available.")
    }else if(isListening) {
        console.log("Already Listening...")
    }else {
        recognition.start();
        isListening = true;
        updateStatus();
        console.log("Started Listening...");
    }
})

stopBtn.addEventListener('click', function() {
    if(!recognition) {
        console.log("Speech not available.")
    }else if(!isListening) {
        console.log("Not Listening currently...")
    }else {
        recognition.stop();
        isListening = false;
        updateStatus();
        console.log("Stopped Listening...");
    }
})

if(recognition) {
    recognition.addEventListener('result', function(e) {
        let text = "";
        for(let i = 0; i < e.results.length; i++) {
            text += e.results[i][0].transcript;
        }
        transcriptArea.value = text;
    })
    recognition.addEventListener('end', function() {
        isListening = false;
        updateStatus();
        console.log("Recognition Ended");
    })
}

saveBtn.addEventListener('click', function() {
    const text = transcriptArea.value.trim();
    if (text !== "") {
        const now = new Date();
        const timestamp = now.toLocaleString();
        const note = {
            text: text,
            timestamp: timestamp
        };
        notes.push(note);
        saveNotesToStorage();
        renderNotes();
        transcriptArea.value = "";
    }
});

function renderNotes() {
    notesList.innerHTML = "";
    for (let i = 0; i < notes.length; i++) {
        const li = document.createElement('li');
        const span = document.createElement('span');
        span.textContent = notes[i].text;
        const timeLabel = document.createElement('small');
        timeLabel.textContent = notes[i].timestamp;
        timeLabel.style.color = "gray";
        timeLabel.style.marginRight = "10px";
        const delBtn = document.createElement('button');
        delBtn.textContent = "Delete";
        delBtn.addEventListener('click', function () {
            notes.splice(i, 1);
            saveNotesToStorage();
            renderNotes();
        });
        li.appendChild(timeLabel);
        li.appendChild(span);
        li.appendChild(delBtn);
        notesList.appendChild(li);
    }
}

function loadNotesFromStorage() {
    const saved = localStorage.getItem(notes_key);
    if (saved) {
        notes = JSON.parse(saved);
        renderNotes();
    }
}

function saveNotesToStorage() {
    localStorage.setItem(notes_key, JSON.stringify(notes));
}

