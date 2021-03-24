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

        <video ref="recvid" id="received-video" autoplay></video>
        <video ref="locvid" id="local-video" autoplay muted></video>
        <button @click="muteAudio">Mute Audio</button>
      </div>
  </div>`,
    data() {
        return {
            peer: undefined,
            stream: undefined,
            peers: [],
            myId: undefined,
            targetId: undefined,
        }
    },
    methods: {
        addVideoStream(video, stream) {
            video.srcObject = stream;
            video.addEventListener('loadedmetadata', () => {
                video.play()
            })
        },

        connectToNewUser(userId, stream) {
            let dd = this;
            const call = this.peer.call(stream, this.stream);
            call.on('stream', userVideoStream => {
                console.log("Adding video stream");
                dd.addVideoStream(dd.$refs.recvid, userVideoStream);
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
                        urls: "stun:stun.l.google.com:19320"
                    }
                ]
            }
        })
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then(stream => {
            console.log("Typeof stream when created: " + Object.prototype.toString.call(stream))
            dd.stream = stream;
            this.addVideoStream(this.$refs.locvid, stream)
            peer.on('call', call => {
                call.answer(stream);
                const video = dd.$refs.recvid;
                call.on('stream', userVideoStream => {
                    dd.addVideoStream(video, userVideoStream)
                })
            })
        })
    },
})