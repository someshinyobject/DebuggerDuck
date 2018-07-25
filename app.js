/**
 * Hello, I'm a duck and I want to help you debug your code...
 * I mean...ummm....quack?
 *   
 * 
 * 
 * @param {any} options 
 */
var DebuggerDuck = function DebuggerDuck(options) {
        // Know thyself
    var self = this,
        // I'll use these when I simply don't know
        defaults = {},
        // This is about all I say...sorry
        responses = ["quack", "quack quack", "...", "quack?"],
        // Unless you say one of these things
        actionMap = {
            "help": {
                
            }
        },
        // I can't say the same thing EVERY TIME. That would be boring
        getRandomInt = function (min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
        };
        
    // Settings those defaults
    self.options = defaults;
    for (var key in options) {
        if (options.hasOwnProperty(key)) {
            if (options[key] !== undefined) {
                self.options[key] = options[key];
            }
        }
    };
    
    // Observer function storage
    self.observers = [];

    // When I receive a message, I think about it first
    self.Hear = function(duckMessenger) {
        var response = new DuckMessenger({
            speaker: "Duck"
        });

        // And then I respond after carefully considering it
        self.Respond(duckMessenger);
    };

    // I respond with this function
    self.Respond = function(duckMessenger) {
        var response = new DuckMessenger({
            speaker: "Duck",
            message: responses[getRandomInt(0, responses.length)]
        });
        self.SendNotification(response);
    };

    // Who's going to observe my interactions
    // might be obsolete if we offload output to a dedicated output object
    self.SubscribeObserver = function(observerFn) {
        self.observers.push(observerFn);
    };

    // Necessary for when I respond. Sends to everyone who observes me
    self.SendNotification = function(notice, scope) {
        var scope = scope || self;
        console.log(self);
        self.observers.forEach(function(m) {
            m.call(scope, notice);
        })
    };

    self.SetInput = function(inputType) {
        self.input = inputType;
        self.input.addObserver(self.SendNotification);
        self.input.addObserver(self.Hear);
    };
}

var DuckMessenger = function DuckMessenger(options) {
    var self = this;

    self.speaker = "";
    self.message = "";
    self.time = new Date();
    
    for (var key in options) {
        if (options.hasOwnProperty(key)) {
            if (options[key] !== undefined) {
                self[key] = options[key];
            }
        }
    }
}
DuckMessenger.prototype.constructor = DuckMessenger;

// Duck Input Strategies
var DuckInput = function DuckInput(inputMethodName) {
    this.method = inputMethodName;
    this.inputObservers = [];
}
DuckInput.prototype = {
    addObserver: function(observer) {
        this.inputObservers.push(observer)
    },
    send: function(message) {
        this.inputObservers.forEach(function(m) {
            m.call(this, message);
        })
    },
    stop: function() { }
}

var SpeechDuckInput = function(options) {
    var self = this,
        defaults = {
            language: "en-US"
        };

    // Settings those defaults
    self.options = defaults;
    for (var key in options) {
        if (options.hasOwnProperty(key)) {
            if (options[key] !== undefined) {
                self.options[key] = options[key];
            }
        }
    };

    //Build a duck input to this scope
    DuckInput.call(this, "Speech Input");

    self.SpeechRecognizer = new (
        window.SpeechRecognition || 
        window.webkitSpeechRecognition || 
        window.mozSpeechRecognition || 
        window.msSpeechRecognition
    )();
    self.SpeechRecognizer.lang = self.options.language;
    self.SpeechRecognizer.interimResults = false;
    self.SpeechRecognizer.continuous = false;
    self.isStarted = false;

    self.SpeechRecognizer.onaudiostart = function(event) {
        console.log("I've started listening");
    };

    self.SpeechRecognizer.onresult = function(event) {
        var newestResult = event.results[event.results.length - 1],
            duckMessenger = new DuckMessenger({
                speaker: "Me",
                message: newestResult[0].transcript
            });
          self.send(duckMessenger);
    };

    self.start = function() {
        self.isStarted = true;
        self.SpeechRecognizer.start();
    };
    self.stop = function() {
        self.isStarted = false;
        self.SpeechRecognizer.stop();
    };
}
SpeechDuckInput.prototype = Object.create(DuckInput.prototype);
SpeechDuckInput.prototype.constructor = SpeechDuckInput;

var TypedDuckInput = function() { 
    DuckInput.call(this, "Typed Input");
}
TypedDuckInput.prototype = Object.create(DuckInput.prototype);
TypedDuckInput.prototype.constructor = TypedDuckInput;

var myDuck = new DebuggerDuck();
myDuck.SubscribeObserver(vm.addMessage);
myDuck.SubscribeObserver(console.log);
