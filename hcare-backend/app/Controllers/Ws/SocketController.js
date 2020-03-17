"use strict";

class SocketController {
  constructor({ socket, request }) {
    this.socket = socket;
    this.request = request;
  }

  //https://adonisjs.com/docs/4.1/websocket

  onMessage(message) {
    this.socket.broadcastToAll("message", message);
  }
  
  onClose() {
    // same as: socket.on('close')
  }

  onError() {
    // same as: socket.on('error')
  }


}

module.exports = SocketController;
