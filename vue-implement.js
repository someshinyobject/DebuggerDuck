var vm = new Vue({
    el: "#chat",
    data: {
        chatMessages: [],
        inputMethod: null,
        new_message: ""
    },
    methods: {
        addMessage: function(message) {
            this.chatMessages.push(message);
        },
        setSpeechInput: function() {
            this.inputMethod = new SpeechDuckInput();
            myDuck.SetInput(this.inputMethod)
            this.inputMethod.start();
        },
        setTypedInput: function() {
            this.inputMethod = new TypedDuckInput();
            myDuck.SetInput(this.inputMethod);
        },
        sendMessage: function() {
            if (this.new_message != "") {
                this.inputMethod.send(new DuckMessenger({
                    speaker: "Me",
                    message: this.new_message
                }));
                this.new_message = "";
            }
        },
        keyCombo: function($event) {
            console.log($event);
        }
    }
})