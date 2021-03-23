const WebRTC = require("./WebRTC");
app.component('dialogue-display', {
    props: {
        socket: {
            type: WebSocket,
            required: true
        }
    },
    template:
    /*html*/
        `
  <div class="dialogue-display">
    <div class="video-display">
        <video ref="rec-vid" id="received-video"></video>
        <video ref="loc-vid" id="local-video"></video>
      </div>
  </div>`,
    data() {
        return {
            connection: new WebRTC()
        }
    },
    methods: {
        invite(client, myId) {
            this.connection.invite(client,);
        },
    },
    mounted() {
        this.connection.set_config(this.socket, this.$refs("rec-vid"), this.$refs("loc-vid"));
    },
})