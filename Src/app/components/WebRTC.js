`
For the poor soul that wakes up to this

Bruker en lett modifisert kode som er beskrevet i https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling
, altså JS Webrtc bibliotek sin offentlige dokumentasjon

Les linken på dypere forklaring på hva alt gjør

Har skrevet TODO på det som må gjøres, har tenkt gjøre det jeg når jeg våkner, bare få stun serveren til å funke

`

class WebRTC {
    constructor() {
        this.myUsername = null;
        this.targetUsername = null;      // To store username of other peer
        this.myPeerConnection = null;    // RTCPeerConnection
        this.transceiver = null;         // RTCRtpTransceiver
        this.webcamStream = null;        // MediaStream from webcam
        this.mediaConstraints = {
            audio: true,            // We want an audio track
            video: {
                aspectRatio: {
                    ideal: 1.333333     // 3:2 aspect is preferred
                }
            }
        };
    }

    invite(evt) {
        if (this.myPeerConnection) {
            alert("You can't start a call because you already have one open!");
        } else {
            let clickedUsername = evt.target.textContent;

            if (clickedUsername === this.myUsername) {
                alert("I'm afraid I can't let you talk to yourself. That would be weird.");
                return;
            }

            this.targetUsername = clickedUsername;
            this.createPeerConnection();

            navigator.mediaDevices.getUserMedia(this.mediaConstraints)
                .then(function (localStream) {
                    document.getElementById("local_video").srcObject = localStream;
                    localStream.getTracks().forEach(track => this.myPeerConnection.addTrack(track, localStream));
                })
                .catch(this.handleGetUserMediaError);
        }
    }

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
    }

    //TODO USE OUR STUN SERVER
    createPeerConnection() {
        this.myPeerConnection = new RTCPeerConnection({
            iceServers: [     // Information about ICE servers - Use your own!
                {
                    urls: "stun:stun.stunprotocol.org" //TODO OUT STUN SERVER
                }
            ]
        });
//TODO USE OUR STUN SERVER

        //TODO implement all these evets, FUCK
        //Need kok pls
        //Sets the event methods for the different necessary events
        this.myPeerConnection.onicecandidate = this.handleICECandidateEvent;
        this.myPeerConnection.ontrack = this.handleTrackEvent;
        this.myPeerConnection.onnegotiationneeded = this.handleNegotiationNeededEvent;
        this.myPeerConnection.onremovetrack = this.handleRemoveTrackEvent;
        this.myPeerConnection.oniceconnectionstatechange = this.handleICEConnectionStateChangeEvent;
        this.myPeerConnection.onicegatheringstatechange = this.handleICEGatheringStateChangeEvent;
        this.myPeerConnection.onsignalingstatechange = this.handleSignalingStateChangeEvent;
    }


    //Kok
    handleNegotiationNeededEvent() {
        this.myPeerConnection.createOffer().then(function (offer) {
            return this.myPeerConnection.setLocalDescription(offer);
        })
            .then(function () {
                sendToServer({ //TODO Change to our server
                    name: myUsername,
                    target: targetUsername,
                    type: "video-offer",
                    sdp: this.myPeerConnection.localDescription
                });
            })
            .catch(reportError);
    }

    //TODO change message format
    handleICECandidateEvent(event) {
        if (event.candidate) {
            sendToServer({
                type: "new-ice-candidate",
                target: targetUsername,
                candidate: event.candidate
            });
        }
    }

    //TODO change to our media elements
    handleTrackEvent(event) {
        document.getElementById("received_video").srcObject = event.streams[0];
        document.getElementById("hangup-button").disabled = false;
    }

    //Det vi skal gjøre når koblingen brytes
    //TODO fix
    handleRemoveTrackEvent(event) {
        var stream = document.getElementById("received_video").srcObject;
        var trackList = stream.getTracks();

        if (trackList.length == 0) {
            closeVideoCall();
        }
    }

    //TODO fix
    handleICEConnectionStateChangeEvent(event) {
        switch (this.myPeerConnection.iceConnectionState) {
            case "closed":
            case "failed":
                this.closeVideoCall();
                break;
        }
    }

    //TODO fix
    handleSignalingStateChangeEvent(event) {
        switch (myPeerConnection.signalingState) {
            case "closed":
                closeVideoCall();
                break;
        }
    };

    //TODO fix
    handleICEGatheringStateChangeEvent(event) {
        // Our sample just logs information to console here,
        // but you can do whatever you need.
    }


    //Hangs up the call
    //TODO fix
    hangUpCall() {
        this.closeVideoCall();
        sendToServer({//TODO message format
            name: myUsername,
            target: targetUsername,
            type: "hang-up"
        });
    }

    //TODO maybe fix
    closeVideoCall() {
        let remoteVideo = document.getElementById("received_video");
        let localVideo = document.getElementById("local_video");

        if (this.myPeerConnection) {
            this.myPeerConnection.ontrack = null;
            this.myPeerConnection.onremovetrack = null;
            this.myPeerConnection.onremovestream = null;
            this.myPeerConnection.onicecandidate = null;
            this.myPeerConnection.oniceconnectionstatechange = null;
            this.myPeerConnection.onsignalingstatechange = null;
            this.myPeerConnection.onicegatheringstatechange = null;
            this.myPeerConnection.onnegotiationneeded = null;

            if (remoteVideo.srcObject) {
                remoteVideo.srcObject.getTracks().forEach(track => track.stop());
            }

            if (localVideo.srcObject) {
                localVideo.srcObject.getTracks().forEach(track => track.stop());
            }

            this.myPeerConnection.close();
            this.myPeerConnection = null;
        }

        remoteVideo.removeAttribute("src");
        remoteVideo.removeAttribute("srcObject");
        localVideo.removeAttribute("src");
        remoteVideo.removeAttribute("srcObject");

        document.getElementById("hangup-button").disabled = true;//TODO these two lines are program specific
        this.targetUsername = null;
    }

    //Accepts handleICECandidateEvent from another client
    //TODO change message format
    handleNewICECandidateMsg(msg) {
        var candidate = new RTCIceCandidate(msg.candidate);

        this.myPeerConnection.addIceCandidate(candidate)
            .catch(reportError);
    }

    //Accepts inncoming video offers sendt from another client
    handleVideoOfferMsg(msg) {
        var localStream = null;

        //TODO Endre til vårt brukernavn
        targetUsername = msg.name;
        createPeerConnection();

        var desc = new RTCSessionDescription(msg.sdp);

        this.myPeerConnection.setRemoteDescription(desc).then(function () {
            return navigator.mediaDevices.getUserMedia(this.mediaConstraints);
        })
            .then(function (stream) {
                localStream = stream;
                document.getElementById("local_video").srcObject = localStream;

                localStream.getTracks().forEach(track => this.myPeerConnection.addTrack(track, localStream));
            })
            .then(function () {
                return this.myPeerConnection.createAnswer();
            })
            .then(function (answer) {
                return this.myPeerConnection.setLocalDescription(answer);
            })
            .then(function () {
                var msg = {
                    name: myUsername, //TODO få inn vår info
                    target: targetUsername,
                    type: "video-answer",
                    sdp: this.myPeerConnection.localDescription
                };

                sendToServer(msg); //TODO endre til vår request, og endre formatet til vårt meldingsystem
            })
            .catch(this.handleGetUserMediaError);
    }
}