// import React, { useState, useEffect } from 'react'
// import socketIOClient from 'socket.io-client/dist/socket.io'
// import { connect_to_doc, add_msg, move_cursor } from './SocketAPIs'

// function Sockets() {
//   const [response, setResponse] = useState('')
//   const [socket, setSocket] = useState(socketIOClient('ws://localhost:8080'))

//   useEffect(() => {
//     connect_to_doc(
//       socket,
//       'a_cool_doc_url',
//       (d) => console.log(d),
//       (d) => console.log(d),
//     )
//   }, [])

//   // useEffect(() => {
//   //   add_msg(socket, {
//   //     x: 128,
//   //     y: 900,
//   //     message_thread_id: '29012921',
//   //     body: 'yo',
//   //     timestamp: 192121090,
//   //     user: 'billy jean',
//   //   })
//   // })

//   // useEffect(() => {
//   //   move_cursor(socket, {"x": 12, "y": 40, "user": "boi"})
//   //   add_msg(socket, {"x": 348, "y": 720, "message_thread_id": "angriborb", "body": "sleeeeep", "timestamp": 192131090, "user": 'goat'})
//   // });

//   return <p>It's {response}</p>
// }

// export default Sockets
