app.component('chat', {
    props: {},

    template:
    /*html*/
        `

<div class="chat">
    <h3>Chat</h3>
    <input id="userName" v-model="userName">
    <textarea id="text" v-model="text">Type here..</textarea>
    <button @click="sendMsg">Send</button>

</div>
`,
    data(){
          return {
              userName: '',
              text: '',
              time_stamp: undefined,
          }
    },
    methods: {
            sendMsg(){
                let textMsg= {
                    userName: this.userName,
                    text: this.text,
                }
                this.$emit('chatMsg-sent', textMsg)

                this.userName = ''
                this.text = ''
            }
    }


})