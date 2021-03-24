app.component('dialogue-display', {
    props: {},
    template:
    /*html*/
        `

    
    
 <div class="dialogue-display">

        <video class="video-1" ref="recvid" id="received-video" autoplay></video>
        <video class="video-2" ref="locvid" id="local-video" autoplay muted></video>
        <button @click="muteAudio">Mute Audio</button>
        <button @click="muteAudio">Mute Audio</button>
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
            const video = dd.$refs.recvid;
            peer.on('call', call => {
                call.answer(stream);
                call.on('stream', userVideoStream => {
                    dd.addVideoStream(video, userVideoStream)
                })
            })
            peer.on('close', () => {
                video.srcObject = null;
            })
        })
    },
})