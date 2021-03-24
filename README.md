# Simple-UDP-4-STUN-Server-with-VUE-WebRTC-app
=================

A simple, STUN server with UDP-4 connectivity, with a VUE3 app for video streaming.
It took a long time to understand both the STUN server (all the buffers...) and the Vue app,
excpecially the WebRTC.
Our group connsists of three people and one of us worked with the STUN server and two on the Vue WebRTC app.
We wanted to make an application to play PlanningPoker


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

 * browserify           - To write Node.js modules to use in the browser
 * Vue 3.0.7 or later   - Frontend tool to make the web page responsive
 * websocket            - To connect to the STUN server

### Installation

Clone the repository

```sh
npm install
```

### Run STUN server and Vue


### stun

```sh
cd src
node ./stun/start.js
```

### Vue

```sh
cd src
node ./app/server.js
```

For the Vue app it  is important to be in the src folder

### STUN RFC

https://tools.ietf.org/html/rfc8489
