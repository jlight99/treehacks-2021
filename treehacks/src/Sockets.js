import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://localhost:8080";

function Sockets() {
  const [response, setResponse] = useState("");

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on("connect_to_doc", data => {
      setResponse(data)
      console.log("data:")
      console.log(data)
    });
    socket.emit("connect_to_doc", "a_cool_doc_url")
  }, []);

  return (
    <p>
      It's {response}
    </p>
  );
}

export default Sockets;