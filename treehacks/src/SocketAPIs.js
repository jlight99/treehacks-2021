export const connect_to_doc = (socket, url, setResponse) => {
    socket.on("connect_to_doc", data => {
      setResponse(data)
      console.log("data:")
      console.log(data)
    });
    socket.emit("connect_to_doc", url)
}

export const add_msg = (socket, msg) => {
    socket.emit("add_msg", msg)
}

export const move_cursor = (socket, msg) => {
    socket.emit("move_cursor", msg)
}
