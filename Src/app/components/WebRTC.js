`
class WebRTC {
    constructor() {
        this.socket = null;
        this.myId = null;
        this.targetId = null;      // To store username of other peer
        this.myPeerConnection = null;    // RTCPeerConnection
        this.transceiver = null;         // RTCRtpTransceiver
        this.webcamStream = null;        // MediaStream from webcam
        this.local_video = null;
        this.rec_video = null;
        this.mediaConstraints = {
            audio: true,            // We want an audio track
            video: {
                aspectRatio: {
                    ideal: 1.333333     // 3:2 aspect is preferred
                }
            }
        };
    }

    set_config(socket, localVid, recVid){
        this.socket = socket;
        this.local_video = localVid;
        this.rec_video = recVid;
    }

    set_id(id){
        this.myId = id;
    }

    invite(client) {
        if (this.myPeerConnection) {
            alert("You can't start a call because you already have one open!");
        } else {
            if (client.id === this.myId) {
                alert("I'm afraid I can't let you talk to yourself. That would be weird.");
                return;
            }

            this.targetId = client.id;
            let myPeerConnection = this.myPeerConnection;
            this.createPeerConnection();
            let rec_video = this.rec_video;


            navigator.mediaDevices.getUserMedia(this.mediaConstraints)
                .then(function (localStream) {
                    rec_video.srcObject = localStream;
                    localStream.getTracks().forEach(track => myPeerConnection.addTrack(track, localStream));
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
                    urls: "stun:stun3.l.google.com:19302" //TODO OUT STUN SERVER
                }
            ]
        });
        //TODO USE OUR STUN SERVER

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
                let data = JSON.stringify({
                    name: this.myId,
                    target: this.targetId,
                    type: "video-offer",
                    sdp: this.myPeerConnection.localDescription
                });
                this.socket.send(JSON.stringify({
                    code: 4,
                    data: data
                }))
            })
            .catch(this.reportError);
    }

    handleICECandidateEvent(event) {
        if (event.candidate) {
            let data = JSON.stringify({
                type: "new-ice-candidate",
                target: this.targetId,
                candidate: event.candidate
            });
            this.socket.send(JSON.stringify({
                code: 4,
                data: data
            }))
        }
    }

    handleTrackEvent(event) {
        console.log("Call ended")
        //document.getElementById("received_video").srcObject = event.streams[0];
        //document.getElementById("hangup-button").disabled = false;
    }

    //Det vi skal gjøre når koblingen brytes
    handleRemoveTrackEvent(event) {
        let stream = document.getElementById("received_video").srcObject;
        let trackList = stream.getTracks();

        if (trackList.length === 0) {
            this.closeVideoCall();
        }
    }

    handleICEConnectionStateChangeEvent(event) {
        switch (this.myPeerConnection.iceConnectionState) {
            case "closed":
            case "failed":
                this.closeVideoCall();
                break;
        }
    }

    handleSignalingStateChangeEvent(event) {
        switch (this.myPeerConnection.signalingState) {
            case "closed":
                this.closeVideoCall();
                break;
        }
    };

    handleICEGatheringStateChangeEvent(event) {
        // Our sample just logs information to console here,
        // but you can do whatever you need.
    }

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
    }

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
    }

    //Accepts handleICECandidateEvent from another client
    handleNewICECandidateMsg(data) {
        let candidate = new RTCIceCandidate(data.candidate);

        this.myPeerConnection.addIceCandidate(candidate)
            .catch(this.reportError);
    }

    reportError(){
        console.log("Error, what to do?")
    }
    
    //Accepts inncoming video offers sendt from another client
    handleVideoOfferMsg(data) {
        let localStream = null;

        //TODO Endre til vårt brukernavn
        this.targetId = data.id;
        this.createPeerConnection();

        let local_video = this.local_video;
        let desc = new RTCSessionDescription(data.sdp);

        this.myPeerConnection.setRemoteDescription(desc).then(function () {
            return navigator.mediaDevices.getUserMedia(this.mediaConstraints);
        })
            .then(function (stream) {
                localStream = stream;
                local_video.srcObject = localStream;

                localStream.getTracks().forEach(track => this.myPeerConnection.addTrack(track, localStream));
            })
            .then(function () {
                return this.myPeerConnection.createAnswer();
            })
            .then(function (answer) {
                return this.myPeerConnection.setLocalDescription(answer);
            })
            .then(function () {
                let msg = {
                    name: this.myId,
                    target: this.targetId,
                    type: "video-answer",
                    sdp: this.myPeerConnection.localDescription
                };
                this.socket.send(JSON.stringify({
                    code: 4,
                    data: msg
                }));
            })
            .catch(this.handleGetUserMediaError);
    }
}
module.exports = WebRTC;`