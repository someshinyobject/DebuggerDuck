var vm = new Vue({
    el: "#chat",
    data: {
        chatMessages: [],
        inputMethod: null,
        new_message: ""
    },
    mounted: function() {
        var myStorage = window.localStorage,
            messages = myStorage.getItem("dd_chat_messages");

        this.chatMessages = JSON.parse(messages) || [];
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
        }
    },
    watch: {
        chatMessages(newVal) {
            var myStorage = window.localStorage;
            myStorage.setItem("dd_chat_messages", JSON.stringify(this.chatMessages));
        }
    }
})