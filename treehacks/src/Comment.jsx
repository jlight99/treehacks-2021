import React, { useState } from 'react'
import './Comment.css'

function Message(props) {
  console.log(props)
  return (
    <div className="message">
      <div className="messageAuthor">{props.data.user}</div>
      <div className="messageBody"> {props.data.body}</div>
    </div>
  )
}

export default function CommentThread(props) {
  console.log('RBZ', props)
  const [messageThreadData, setMessageThreadData] = useState(
    props.messageThreadData,
  )
  return (
    <div
      className="messageThread"
      style={{
        left: messageThreadData.left + 'px',
        top: messageThreadData.top + 'px',
        position: 'absolute',
      }}
    >
      {messageThreadData.messages.map((messageData) => (
        <Message data={messageData} />
      ))}
    </div>
  )
}
