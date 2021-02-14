import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import {connect_to_doc, add_msg, move_cursor} from "./SocketAPIs"

function Sockets() {
  const [response, setResponse] = useState('')
  const [socket, setSocket] = useState(socketIOClient('ws://localhost:8080'))

  useEffect(() => {
    connect_to_doc(socket, 'a_cool_doc_url', setResponse)
  }, [])

  useEffect(() => {
    add_msg(socket, {
      x: 128,
      y: 900,
      message_thread_id: '29012921',
      body: 'yo',
      timestamp: 192121090,
      user: 'billy jean',
    })
  })

  useEffect(() => {
    move_cursor(socket, {"x": 12, "y": 40, "user": "boi"})
  });

  return (
    <p>
      It's {response}
    </p>
  );
}

export default Sockets
