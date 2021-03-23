app.component('dialogue-display', {
    props: {},
    template:
    /*html*/
        `

 <div class="grid-container">
 
    <div class="list-of-rooms">
        <li v-for="room in rooms">{{room}}</li>
    </div>
    
    <div class="set-user-name-button">
        <textarea rows="1" cols="20" id="setUsernameField">Username</textarea>
        <button @click="setUserName">Set Username</button>
    </div>
    
 <div class="dialogue-display">
      <div class="video-display">
        <video ref="recvid" id="received-video" autoplay></video>
        <video ref="locvid" id="local-video" autoplay muted></video>
      </div>
      </div>
  </div>`,
    data() {
        return {
            peer: undefined,
            peers: [],
        }
    },
    methods: {
        addVideoStream(video, stream) {
            video.srcObject = stream
            video.addEventListener('loadedmetadata', () => {
                video.play()
            })
        },

        connectToNewUser(userId) {
            let stream = this.peer.Stream;
            let dd = this;
            const call = this.peer.call(userId, stream)
            call.on('stream', userVideoStream => {
                dd.addVideoStream(dd.$refs.recvid, userVideoStream)
            })
            call.on('close', () => {
            })

            this.peers[userId] = call
        },
    },
    mounted() {
        console.log("Mounting peer")
        let dd = this;
        let peer = this.peer = new Peer(undefined, {
            config: {
                iceServers: [
                    {
                        url: "stun:stun.l.google.com:19320"
                    }
                ]
            }
        })
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then(stream => {
            this.addVideoStream(this.$refs.locvid, stream)
            peer.on('call', call => {
                call.answer(stream)
                const video = dd.$refs.locvid
                call.on('stream', userVideoStream => {
                    dd.addVideoStream(video, userVideoStream)
                })
            })
        })
    },
})