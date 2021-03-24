# Simple-UDP-4-STUN-Server-with-Vue-WebRTC-app
=================

https://github.com/AndersNormannHermanrud/Stun_Server

A simple, STUN server with UDP-4 connectivity, with a Vue3 app for video streaming.

Our group connsists of three people and one of us worked with the STUN server and two on the Vue WebRTC app.

Our goal was to make an application to play PlanningPoker.

It took a long time to understand both the STUN server (all the buffers...).
And we also struggled with the Vue app, excpecially the WebRTC to get the video streaming to work


### Functions

 * STUN server
 * UDP-4
 * MAPPED_ADDRESS
 * Vue 3 app
 * Video and Audio Streaming


### Future work

For the STUN server we struggled to make it work, so a lot of work could still be done.
More Attributes like UDP-6, TCP or XOR_MAPPED_ADDRESS would be the next step.

For the web application we never got to the PlanningPoker part of the application.


### Dependencies

 * Vue 3.0.7 or later   - Frontend tool to make the web page responsive
 * websocket            - To connect to the STUN server
 * socket.io            - Better websocket library used for WebRTC


### Installation

Clone the repository

```sh
npm install
```

### Run STUN server and Vue


#### STUN

```sh
cd src
node ./stun/start.js
```

#### Vue

```sh
cd src
node ./app/server.js
```

For the Vue app it  is important to be in the src folder

### STUN RFC

https://tools.ietf.org/html/rfc8489


### References & Inspiration

Taken inspiration from different STUN servers, to understand how they work.
* https://github.com/englercj/stun.js
* https://github.com/noahlevenson/ministun
* https://github.com/duhruh/stutter.js
* https://www.w3schools.com/nodejs/ref_buffer.asp - Buffer information
* https://www.w3schools.com/js/js_numbers.asp - Hexadecimal information
* https://www.youtube.com/watch?v=FExZvpVvYxA - Very good WebRTC crash course
* https://www.html5rocks.com/en/tutorials/webrtc/basics/#toc-mediastream
* https://webrtc.github.io/samples/ - WebRTC bible
* chrome://webrtc-internals/ - To test the WebRTC connections
