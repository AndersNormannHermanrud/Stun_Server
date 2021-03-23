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
            socket: null,
            myId: null,
            targetId: null,
            myPeerConnection: null,
            transceiver: null,
            webcamStream: null,
            local_video: null,
            rec_video: null,
            mediaConstraints: {
                audio: true,
                video: {
                    aspectRatio: {
                        ideal: 1.333333
                    }
                }
            },


        }
    },
    methods: {
        invite(client) {
            if (this.myPeerConnection) {
                alert("You can't start a call because you already have one open!");
            } else {
                if (client.id === this.myId) {
                    alert("I'm afraid I can't let you talk to yourself. That would be weird.");
                    return;
                }

                this.targetId = client.id;
                this.createPeerConnection();
                let myPeerConnection = this.myPeerConnection;
                let rec_video = this.rec_video;

                navigator.mediaDevices.getUserMedia(this.mediaConstraints)
                    .then(function (localStream) {
                        rec_video.srcObject = localStream;
                        localStream.getTracks().forEach(track => myPeerConnection.addTrack(track, localStream));
                    })
                    .catch(this.handleGetUserMediaError);
            }
        },
        setUserName(){
            this.$emit('set-user-name')
        }

        set_id(id) {
            this.myId = id;
        },

        setSocket(socket) {
            this.socket = socket;
        },

        createConnection(socket) {
            this.socket = socket;
            this.local_video = this.$refs.locvid;
            this.rec_video = this.$refs.recvid;
        },

        handleNewICECandidateMsg(data) {
            console.log("ICECandidateMsg: " + data.candidate)
            let candidate = new RTCIceCandidate(data.candidate);
            this.myPeerConnection.addIceCandidate(candidate)
                .catch(this.reportError);
        },

        handleVideoOfferMsg(data) {
            if (!this.myPeerConnection) {
                this.createPeerConnection()
            }
            let localStream = null;
            let targetId = this.targetId = data.id;
            let myId = this.myId;
            let myPeerConnection = this.myPeerConnection;
            let socket = this.socket;
            let mediaConstraint = this.mediaConstraints;
            let local_video = this.local_video;
            let desc = new RTCSessionDescription(data.sdp);

            console.log("Filler for debugging")

            myPeerConnection.setRemoteDescription(desc).then(function () {
                return navigator.mediaDevices.getUserMedia(mediaConstraint);
            })
                .then(function (stream) {
                    localStream = stream;
                    local_video.srcObject = localStream;

                    localStream.getTracks().forEach(track => myPeerConnection.addTrack(track, localStream));
                })
                .then(function () {
                    return myPeerConnection.createAnswer();
                })
                .then(function (answer) {
                    return myPeerConnection.setLocalDescription(answer);
                })
                .then(function () {
                    let msg = JSON.stringify({
                        id: myId,
                        target: targetId,
                        type: "video-answer",
                        sdp: myPeerConnection.localDescription
                    });
                    socket.send(JSON.stringify({
                        code: 4,
                        data: msg
                    }));
                })
                .catch(this.handleGetUserMediaError);
        },

        handleGetUserMediaError(e) {
            switch (e.name) {
                case "NotFoundError":
                    alert("Unable to open your call because no camera and/or microphone" +
                        "were found.");
                    break;
                case "SecurityError":
                case "PermissionDeniedError":
                    // Do nothing; this is the same as the user canceling the call.
                    break;
                default:
                    alert("Error opening your camera and/or microphone: " + e.message);
                    break;
            }
            this.closeVideoCall();
        },

        createPeerConnection() {
            this.myPeerConnection = new RTCPeerConnection({
                iceServers: [     // Information about ICE servers - Use your own!
                    {
                        urls: "stun:stun3.l.google.com:19302" //TODO OUT STUN SERVER
                    }
                ]
            });

            //Sets the event methods for the different necessary events
            this.myPeerConnection.onicecandidate = this.handleICECandidateEvent;
            this.myPeerConnection.ontrack = this.handleTrackEvent;
            this.myPeerConnection.onnegotiationneeded = this.handleNegotiationNeededEvent;
            this.myPeerConnection.onremovetrack = this.handleRemoveTrackEvent;
            this.myPeerConnection.oniceconnectionstatechange = this.handleICEConnectionStateChangeEvent;
            this.myPeerConnection.onicegatheringstatechange = this.handleICEGatheringStateChangeEvent;
            this.myPeerConnection.onsignalingstatechange = this.handleSignalingStateChangeEvent;
        },

        handleNegotiationNeededEvent() {
            let myPeerConnection = this.myPeerConnection;
            let socket = this.socket;
            let myId = this.myId;
            let targetId = this.targetId;
            this.myPeerConnection.createOffer().then(function (offer) {
                return myPeerConnection.setLocalDescription(offer);
            })
                .then(function () {
                    let data = JSON.stringify({
                        id: myId,
                        target: targetId,
                        type: "video-offer",
                        sdp: myPeerConnection.localDescription
                    });
                    socket.send(JSON.stringify({
                        code: 4,
                        data: data
                    }))
                    console.log("Target ID: " + targetId + "\tMy Id:" + myId)
                })
                .catch(this.reportError);
        },

        handleICECandidateEvent(event) {
            console.log("Ice Candidate: " + event.candidate);
            let target = this.targetId;
            let socket = this.socket;
            if (event.candidate) {
                let data = JSON.stringify({
                    type: "new-ice-candidate",
                    target: target,
                    candidate: event.candidate
                });
                socket.send(JSON.stringify({
                    code: 4,
                    data: data
                }));
            }
        },

        handleTrackEvent(event) {
            console.log("Call ended")
            //document.getElementById("received_video").srcObject = event.streams[0];
            //document.getElementById("hangup-button").disabled = false;
        },

        //Det vi skal gjøre når koblingen brytes
        handleRemoveTrackEvent(event) {
            console.log("handleRemoveTrackEvent called")
            let stream = document.getElementById("received_video").srcObject;
            let trackList = stream.getTracks();

            if (trackList.length === 0) {
                this.closeVideoCall();
            }
        },

        handleICEConnectionStateChangeEvent(event) {
            console.log("handleICEConnectionStateChangeEvent")
            switch (this.myPeerConnection.iceConnectionState) {
                case "closed":
                case "failed":
                    this.closeVideoCall();
                    break;
            }
        },

        handleSignalingStateChangeEvent(event) {
            console.log("handleSignalingStateChangeEvent")
            switch (this.myPeerConnection.signalingState) {
                case "closed":
                    this.closeVideoCall();
                    break;
            }
        },

        handleICEGatheringStateChangeEvent(event) {
            // Our sample just logs information to console here,
            // but you can do whatever you need.
        },

        hangUpCall() {
            this.closeVideoCall();
            let data = JSON.stringify({//TODO message format
                name: this.myId,
                target: this.targetId,
                type: "hang-up"
            });
            this.socket.send(JSON.stringify({
                code: 4,
                data: data
            }))
        },

        closeVideoCall() {
            //TODO our video elements
            //let remoteVideo = document.getElementById("received_video");
            //let localVideo = document.getElementById("local_video");

            if (this.myPeerConnection) {
                this.myPeerConnection.ontrack = null;
                this.myPeerConnection.onremovetrack = null;
                this.myPeerConnection.onremovestream = null;
                this.myPeerConnection.onicecandidate = null;
                this.myPeerConnection.oniceconnectionstatechange = null;
                this.myPeerConnection.onsignalingstatechange = null;
                this.myPeerConnection.onicegatheringstatechange = null;
                this.myPeerConnection.onnegotiationneeded = null;
                /*
                            if (remoteVideo.srcObject) {
                                remoteVideo.srcObject.getTracks().forEach(track => track.stop());
                            }

                            if (localVideo.srcObject) {
                                localVideo.srcObject.getTracks().forEach(track => track.stop());
                            }
                */
                this.myPeerConnection.close();
                this.myPeerConnection = null;
            }
            /*
                    remoteVideo.removeAttribute("src");
                    remoteVideo.removeAttribute("srcObject");
                    localVideo.removeAttribute("src");
                    remoteVideo.removeAttribute("srcObject");

                    document.getElementById("hangup-button").disabled = true;//TODO these two lines are program specific
             */
            this.targetId = null;
        },

        reportError() {
            console.log("Error, what to do?")
        },

    },
})