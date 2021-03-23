app.component('dialogue-display', {
    props: {},
    template:
    /*html*/
        `
  <div class="dialogue-display">
    <div class="video-display">
        <video ref="recvid" id="received-video"></video>
        <video ref="locvid" id="local-video"></video>
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

        connectToNewUser(userId, stream) {
            let dd = this;
            const call = this.peer.call(userId, stream)
            //const video = document.createElement('video')
            call.on('stream', userVideoStream => {
                dd.addVideoStream(dd.$refs.recvid, userVideoStream)
            })
            call.on('close', () => {
                //video.remove()
            })

            this.peers[userId] = call
        },
    },
    mounted() {
        let dd = this;
        let peer = this.peer = new Peer(undefined, {
            host: '/',
            port: '3001'
        })
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then(stream => {
            this.addVideoStream(this.$refs.recvid, stream)
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