const textApiURL = "https://baconipsum.com/api/?type=filler&paras=1&format=text";
const textSection = document.getElementById("quote");
const userInput = document.getElementById("quote-input");
let quote = "";
let time = 60;
let timer = "";
let mistakes = 0;
let startTime;

const generateText = async () => {
    try {
        const response = await fetch(textApiURL);
        const data = await response.text();
        quote = data;

        let arr = quote.split("").map((value) => {
            return "<span class='quote-chars'>" + value + "</span>";
        });
        textSection.innerHTML = arr.join("");
    } catch (error) {
        console.error("Error fetching the quote:", error);
        textSection.innerHTML = "Error fetching the quote. Please try again later.";
    }
};

userInput.addEventListener("input", () => {
    let quoteChars = document.querySelectorAll(".quote-chars");

    quoteChars = Array.from(quoteChars);

    let userInputChars = userInput.value.split("");

    quoteChars.forEach((char, index) => {
        if (char.innerText == userInputChars[index]) {
            char.classList.add("success");
            char.classList.remove("fail");
        } else if (userInputChars[index] == null) {
            char.classList.remove("success", "fail");
        } else {
            if (!char.classList.contains("fail")) {
                mistakes++;
                char.classList.add("fail");
            }
            char.classList.remove("success");
        }
    });

    document.getElementById("mistakes").innerText = mistakes;

    let check = quoteChars.every((element) => {
        return element.classList.contains("success");
    });
    if (check) {
        displayResult();
    }
});

function updateTimer() {
    if (time == 0) {
        displayResult();
    } else {
        document.getElementById("timer").innerText = --time + "s";
    }
}

// Set timer
const timeReduce = () => {
    time = 60;
    startTime = new Date(); // Capture start time
    timer = setInterval(updateTimer, 1000);
}

const displayResult = () => {
    document.querySelector(".result").style.display = "block";
    clearInterval(timer);
    document.getElementById("stop-test").style.display = "none";
    userInput.disabled = true;

    let timeTaken = (60 - time) / 60; // Calculate the elapsed time in minutes
    let wordsTyped = userInput.value.trim().split(/\s+/).length; // Count words typed
    let wpm = (wordsTyped / timeTaken).toFixed(2); // Calculate WPM

    document.getElementById("wpm").innerText = wpm + " wpm";

    let accuracy = Math.round(((userInput.value.length - mistakes) / userInput.value.length) * 100);
    document.getElementById("accuracy").innerText = accuracy + " %";
};

// Starting the test
const startTest = () => {
    mistakes = 0;
    userInput.disabled = false;
    userInput.value = "";
    timeReduce();
    document.getElementById("start-test").style.display = "none";
    document.getElementById("stop-test").style.display = "block";
    document.getElementById("mistakes").innerText = mistakes;
    document.getElementById("timer").innerText = "60s";
    textSection.innerHTML = "";
    generateText();
};

window.onload = () => {
    userInput.value = "";
    document.getElementById("start-test").style.display = "block";
    document.getElementById("stop-test").style.display = "none";
    userInput.disabled = true;
    generateText();
}