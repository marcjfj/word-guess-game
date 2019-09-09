
var game = {
    alphabet: {
        string: "abcdefghijklmnopqrstuvwxyz",
        array: function(){ return this.string.split("")}
    },
    scene: {
        image: function(){return document.querySelector(".scene-image")},
        text: function(){return document.querySelector(".scene-text")},
        phraseBox: function(){return document.querySelector(".phrase")},
        alphabetBox: function(){return document.querySelector(".letters")},

    },
    intro: {
        box: function(){return document.querySelector(".intro")},
        head: function(){return document.querySelector(".headline")},
        text: function(){return document.querySelector(".intro-text")},
        image: function(){return document.querySelector(".intro-image")},
        button: function(){return document.querySelector(".start")}
    },
    counters: {
        round: function(){return document.querySelector(".round")},
        score: function(){return document.querySelector(".score")},
        guesses: function(){return document.querySelector(".guesses")},
    },
    sounds: {
        init: function(){
            this.loop = new Audio('./sounds/loop.wav');
            this.fail = new Audio('./sounds/fail.wav');
            this.win = new Audio('./sounds/win.wav');
            this.correct = new Audio('./sounds/correct.wav');
            this.wrong = new Audio('./sounds/wrong.wav');
        }
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
        game.scene.phraseBox().innerHTML = "";
        game.scene.alphabetBox().innerHTML = "";
        game.matches = [];
        game.badGuesses = [];
        
    },
    initialize: function(round){
        game.sounds.fail.pause();
        game.sounds.fail.currentTime = 0;
        game.sounds.win.pause();
        game.sounds.win.currentTime = 0;
        game.clear();
        game.lives = 5;
        game.counters.round().textContent = round + 1;
        game.counters.guesses().textContent = game.lives;
        game.counters.score().textContent = game.score;
        game.scene.text().textContent = game.stages[round].hint;
        game.scene.image().src = game.stages[round].hintImage;
        game.phrase = game.stages[round].phrase;
        game.phraseArray = game.phrase.split("");
        game.sounds.loop.loop = true;
        game.sounds.loop.play();
        
        game.phraseArray.forEach(function(letter){
            var letterBox = document.createElement("div");
            letterBox.classList.add("letter-box");
            // letterBox.textContent = letter;
            game.scene.phraseBox().appendChild(letterBox);
        });
        
        game.alphabet.array().forEach(function(letter){
            var letterButton = document.createElement("button");
            letterButton.classList.add("letter-button");
            letterButton.value = letter;
            letterButton.textContent = letter;
            game.scene.alphabetBox().appendChild(letterButton);
        });
        var letterButtons = document.querySelectorAll(".letter-button");
        letterButtons.forEach(function(button){
            button.addEventListener("click", game.guess.bind(null, button.value), false);
    
        });
        document.addEventListener("keydown", game.guess);

    },
    wrong: function(letter){
        game.sounds.wrong.currentTime = 0;
        game.sounds.wrong.play();
        var alphabetNodes = document.querySelectorAll(".letter-button");
        alphabetNodes.forEach(function(button){
            if (button.value === letter){
                button.classList.add("wrong");
            }
        });
        game.lives--;
        game.counters.guesses().textContent = game.lives;
        if (game.lives === 0){
            game.endScene(false);
            
        }
    },
    match: function(letter){
        game.sounds.correct.currentTime = 0;
        game.sounds.correct.play();
        var phraseNodes = document.querySelectorAll(".letter-box");
        game.phraseArray.forEach(function(unit, i){
            if (unit === letter){
                
                phraseNodes[i].textContent = letter;
            }
        });
        var alphabetNodes = document.querySelectorAll(".letter-button");
        alphabetNodes.forEach(function(button){
            if (button.value === letter){
                button.classList.add("matched");
            }
        });
    },
    guess: function(letter){
        if (letter.key){
            letter = letter.key.toLowerCase();
        }
        if (game.alphabet.array().indexOf(letter) === -1){
            return;
        }
        if (game.matches.indexOf(letter) < 0 && game.badGuesses.indexOf(letter) < 0){
            
            var match = game.phraseArray.indexOf(letter);
            if (match !== -1){
                while (match !== -1){
                    game.match(letter);
                    game.matches.push(letter);
                    match = game.phraseArray.indexOf(letter, match + 1);
                }
                if (game.matches.length === game.phraseArray.length){
                    
                    game.endScene(true);
                }
            }else{
                game.badGuesses.push(letter);
                game.wrong(letter);
            }
        }
    },
    phraseState: function(state){
        var phraseLetters = document.querySelectorAll(".letter-box");
        phraseLetters.forEach(function(letter){

            if (state === "win"){
                letter.classList.add("matched");
            }else if (state === "lose"){
                letter.classList.add("wrong");
            }
        });
            
    },

    endScene: function(win){
        document.removeEventListener("keydown", game.guess);
        if (win){
            game.intro.head().textContent = "You Did it!"
            game.intro.text().textContent = game.stages[game.round].winText;
            game.intro.image().src = game.stages[game.round].winImage;
            game.sounds.loop.pause();
            game.sounds.loop.currentTime = 0;
            game.sounds.win.currentTime = 0;
            game.sounds.win.play();
            game.score++
            game.phraseState("win");
            
        }else{
            game.intro.head().textContent = "You Failed..."
            game.intro.text().textContent = game.stages[game.round].loseText;
            game.intro.image().src = game.stages[game.round].loseImage;
            game.sounds.loop.pause();
            game.sounds.loop.currentTime = 0;
            game.sounds.fail.currentTime = 0;
            game.sounds.fail.play();
            game.phraseState("lose");
            
        }
        if ((game.stages.length - 1) === game.round){
            game.intro.button().textContent = "Start Over";     
            game.round = -1;
            game.score = 0;           
        }else{
            game.intro.button().textContent = "Next Round";
        }

        setTimeout(function(){
            game.intro.box().classList.remove("move-away");
            game.intro.button().disabled = false;
            game.intro.button().focus();
            game.round++;

        }, 1000);
           
    },
    setup: function(){
        game.round = 0;
        game.score = 0;
        game.sounds.init();
        game.intro.button().addEventListener("click", function(){
            game.intro.box().classList.add("move-away");
            game.intro.button().disabled = true;
            game.initialize(game.round);
        });
    }   
}



game.setup();


