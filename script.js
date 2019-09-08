var introHead = document.querySelector(".headline");
var introText = document.querySelector(".intro-text");
var introImage = document.querySelector(".intro-image");
var phraseBox = document.querySelector(".phrase");
var alphabetBox = document.querySelector(".letters");
var sceneText = document.querySelector(".scene-text");
var sceneImage = document.querySelector(".scene-image");
var startButton = document.querySelector(".start");
var intro = document.querySelector(".intro");
var roundCount = document.querySelector(".round");
var guessCount = document.querySelector(".guesses");
var round = 0;
var phrase, phraseArray, guessed, lives;
var loopTrack = new Audio('./sounds/loop.wav');
var failTrack = new Audio('./sounds/fail.wav');
var winTrack = new Audio('./sounds/win.wav');
var correctTrack = new Audio('./sounds/correct.wav');
var wrongTrack = new Audio('./sounds/wrong.wav');
loopTrack.loop = true;
var matches = [];
var badGuesses = [];



var game = {

    alphabet: {
        string: "abcdefghijklmnopqrstuvwxyz",
        array: function(){ return this.string.split("")}
    },

    stages: [
        {
            phrase: "malfunction",
            hint: "Bob gets ready for his morning commute",
            hintImage: "./images/car.svg",
            winText: "Bob decides walk to work today",
            winImage: "./images/walk.svg",
            loseText: "Bob's brakes malfunction and he rear-ends a lawyer.",
            loseImage: "./images/fender.svg"
        },
        {
            phrase: "terminated",
            hint: "Bob arrives to work.",
            hintImage: "./images/work.svg",
            winText: "Bob decides he doesn't really like working, instead he goes fishing",
            winImage: "./images/fishing.svg",
            loseText: "Bob finds out that his job has been made redundant by machines. He is terminated",
            loseImage: "./images/fired.svg"
        },
        {
            phrase: "infidelity",
            hint: "Bob decides to surprise his girlfriend with flowers",
            hintImage: "./images/gf.svg",
            winText: "Bob decides he doesn't really like his girlfriend, instead goes to a strip club",
            winImage: "./images/club.svg",
            loseText: "Bob finds his girlfriend in bed with his boss",
            loseImage: "./images/bed.svg"
        },
        {
            phrase: "bereavement",
            hint: "Bob heads home to spend time with his beloved cat",
            hintImage: "./images/home.svg",
            winText: "Bob decides he doesn't really like his cat, instead goes to the strip club",
            winImage: "./images/club.svg",
            loseText: "Bob realizes that he hasn't fed his cat in weeks",
            loseImage: "./images/cat.svg"
        },
        {
            phrase: "diagnosed",
            hint: "Bob gets a phone call",
            hintImage: "./images/phone.svg",
            winText: "Bob doesn't answer the phone.",
            winImage: "./images/club.svg",
            loseText: "It's his doctor. It turns out that the lump that he found isn't benign after all.",
            loseImage: "./images/doctor.svg"
        },
    ],
    clear: function(){
        phraseBox.innerHTML = "";
        alphabetBox.innerHTML = "";
        matches = [];
        badGuesses = [];
        
    },
    initialize: function(round){
        game.clear();
        lives = 5;
        roundCount.textContent = round + 1;
        guessCount.textContent = lives;
        sceneText.textContent = game.stages[round].hint;
        sceneImage.src = game.stages[round].hintImage;
        phrase = game.stages[round].phrase;
        phraseArray = phrase.split("");
        loopTrack.play();
        
        phraseArray.forEach(function(letter){
            var letterBox = document.createElement("div");
            letterBox.classList.add("letter-box");
            // letterBox.textContent = letter;
            phraseBox.appendChild(letterBox);
        });
        
        game.alphabet.array().forEach(function(letter){
            var letterButton = document.createElement("button");
            letterButton.classList.add("letter-button");
            letterButton.value = letter;
            letterButton.textContent = letter;
            alphabetBox.appendChild(letterButton);
        });
        var letterButtons = document.querySelectorAll(".letter-button");
        letterButtons.forEach(function(button){
            button.addEventListener("click", game.guess.bind(null, button.value), false);
    
        });
        document.addEventListener("keydown", game.guess);

    },
    wrong: function(letter){
        wrongTrack.currentTime = 0;
        wrongTrack.play();
        var alphabetNodes = document.querySelectorAll(".letter-button");
        alphabetNodes.forEach(function(button){
            if (button.value === letter){
                button.classList.add("wrong");
            }
        })
        lives--;
        guessCount.textContent = lives;
        if (lives === 0){
            game.endScene(false);
            
        }
    },
    match: function(letter){
        correctTrack.currentTime = 0;
        correctTrack.play();
        var phraseNodes = document.querySelectorAll(".letter-box");
        phraseArray.forEach(function(unit, i){
            if (unit === letter){
                
                phraseNodes[i].textContent = letter;
            }
        });
        var alphabetNodes = document.querySelectorAll(".letter-button");
        alphabetNodes.forEach(function(button){
            if (button.value === letter){
                button.classList.add("matched");
            }
        })
    },
    guess: function(letter){
        // console.log(letter);
        if (letter.key){
            letter = letter.key.toLowerCase();
        }
        if (game.alphabet.array().indexOf(letter) === -1){
            return;
        }
        if (matches.indexOf(letter) < 0 && badGuesses.indexOf(letter) < 0){
            
            var match = phraseArray.indexOf(letter);
            if (match !== -1){
                while (match !== -1){
                    game.match(letter);
                    matches.push(letter);
                    match = phraseArray.indexOf(letter, match + 1);
                }
                if (matches.length === phraseArray.length){
                    
                    game.endScene(true);
                }
            }else{
                badGuesses.push(letter);
                console.log(badGuesses);
                game.wrong(letter);
            }
            console.log(matches);
        }
    },

    endScene: function(win){
        document.removeEventListener("keydown", game.guess);
        if (win){
            introHead.textContent = "You Did it!"
            introText.textContent = game.stages[round].winText;
            introImage.src = game.stages[round].winImage;
            loopTrack.pause();
            loopTrack.currentTime = 0;
            winTrack.currentTime = 0;
            winTrack.play();
            

        }else{
            introHead.textContent = "You Failed..."
            introText.textContent = game.stages[round].loseText;
            introImage.src = game.stages[round].loseImage;
            loopTrack.pause();
            loopTrack.currentTime = 0;
            failTrack.currentTime = 0;
            failTrack.play();
            
        }
        if ((game.stages.length - 1) === round){
            startButton.textContent = "Start Over";     
            round = -1;            
        }else{
            startButton.textContent = "Next Round";
        }    
        intro.classList.remove("move-away");
        startButton.disabled = false;
        startButton.focus();
        round++;   
    }
    
    
}


startButton.addEventListener("click", function(){
    intro.classList.add("move-away");
    startButton.disabled = true;
    game.initialize(round);
})



