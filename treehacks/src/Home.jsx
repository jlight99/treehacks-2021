import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
  setState,
} from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import axios from 'axios'
import CommentThread from './Comment'
import Sockets from './Sockets'
import './Home.css'
import { connect_to_doc, add_msg, move_cursor } from './SocketAPIs'
import socketIOClient from 'socket.io-client'

let alreadyConnected = false
let socket = socketIOClient('ws://localhost:8080')

export default function Home(props) {
  const pagescreenApiUrl = 'https://api.pagescreen.io/v1/capture.json'
  const [url, setUrl] = useState('')
  const [user, setUser] = useState('Ellen')
  const [contentPermalink, setContentPermalink] = useState('')
  const [contentReady, setContentReady] = useState(false)
  const [openCommentTop, setOpenCommentTop] = useState(0)
  const [openCommentLeft, setOpenCommentLeft] = useState(0)
  const [openCommentText, setOpenCommentText] = useState('')
  const [displayOpenComment, setDisplayOpenComment] = useState(false)
  const [messageThreadData, setMessageThreadData] = useState([
    {
      left: 300,
      top: 420,
      message_thread_id: 'a',
      messages: [
        {
          user: 'Robbie',
          timestamp: 1613281738,
          body: "cookie you're a footer",
        },
      ],
    },
    {
      left: 250,
      top: 225,
      message_thread_id: 'b',
      messages: [
        {
          user: 'Bimesh',
          timestamp: 1613281738,
          body: 'random guy on reddit',
        },
      ],
    },
    {
      left: 800,
      top: 380,
      message_thread_id: 'c',
      messages: [
        {
          user: 'Ellen',
          timestamp: 1613281738,
          body:
            'full stack 2nd coop by the way asdlk jasldk jal;sk fjlaskdfjal;skdfjalksj;lk sj;lk jasl; kjasld kjfalskdfj l;sadkfjals;dkfj;alskdfjl;sakdjfa;sldfj;alskfja;lsdjfa',
        },
        {
          user: 'Robbie',
          timestamp: 1613281738,
          body: "cookie you're a footer",
        },
        {
          user: 'Ellen',
          timestamp: 1613281738,
          body: "cookie you're a footer",
        },
      ],
    },
  ])

  const addNewMessage = (newMessage) => {
    const threadIdx = messageThreadData.findIndex(
      (thread) => thread.message_thread_id == newMessage.message_thread_id,
    )
    // If the thread is found!
    if (threadIdx != -1) {
      let data = messageThreadData
      data[threadIdx].messages.push({
        user: user,
        timestamp: Date.now(),
        body: newMessage.body,
      })
      setMessageThreadData(data)
    } else if (newMessage.left && newMessage.top) {
      // If we are creating a new message
      setMessageThreadData([...messageThreadData, newMessage])
    } else {
      console.log('Invalid new message', newMessage)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
    }
  })

  /*
   * Upon user mouse click, open a textfield where they can type their comment.
   */
  const handleClick = (e) => {
    if (!displayOpenComment) {
      setOpenCommentLeft(e.pageX)
      setOpenCommentTop(e.pageY)
      setDisplayOpenComment(true)
    }
  }

  /*
   * Update the comment text as the user types to display their changes in real time.
   */
  const handleCommentTextChange = (event) => {
    setOpenCommentText(event.target.value)
  }

  /*
   * Send the comment data to the server in order to create a new comment.
   */
  const handleCommentSubmit = (event) => {
    event.preventDefault()
    const id = (+new Date()).toString(36)
    const timestamp = Date.now()
    const localMessage = {
      left: openCommentLeft,
      top: openCommentTop,
      message_thread_id: id,
      messages: [
        {
          user: user,
          timestamp: timestamp,
          body: openCommentText,
        },
      ],
    }
    addNewMessage(localMessage)
    setDisplayOpenComment(false)
    add_msg(socket, {
      user: user,
      body: openCommentText,
      message_thread_id: id,
      x: openCommentLeft,
      y: openCommentTop,
      timestamp: +new Date(),
    })
  }

  /*
   * Update the input URL as the user types to display their changes in real time.
   */
  const handleUrlChange = (event) => {
    setUrl(event.target.value)
  }

  const handleUserChange = (event) => {
    setUser(event.target.value)
  }

  /*
   * Accept an URL as input from the user, capture a screenshot of that URL using the PageScreen API,
   * and display the screenshot on our webpage.
   */
  const handleUrlSubmit = (event) => {
    event.preventDefault()
    axios({
      method: 'post',
      url: pagescreenApiUrl,
      data: {
        url: url,
      },
      auth: {
        username: 'pk_screenshot_5bb5cd295c45a',
        password: 'sk_screenshot_0f0550e020db6',
      },
    })
      .then((data) => {
        if (data.data.data[0]) {
          setContentPermalink(data.data.data[0].permalink)
        } else {
          setContentPermalink(data.data.data.permalink)
        }

        var millisecondsToWait = 1000
        setTimeout(function () {
          setContentReady(true)
        }, millisecondsToWait)
      })
      .catch((err) => console.log(err))
  }

  const add_msg_cb = (msg) => {
    console.log('Got new message from another user', msg)
    const newMessage = {
      left: msg['x'],
      top: msg['y'],
      message_thread_id: msg['message_thread_id'],
      messages: [
        {
          user: msg['user'],
          timestamp: Date.now(),
          body: msg['body'],
        },
      ],
    }
    addNewMessage(newMessage)
  }

  const move_cursor_cb = (pos) => {
    console.log('pos')
    console.log(pos)
  }

  if (!alreadyConnected) {
    console.log('Send info')
    connect_to_doc(socket, { url: url, user: user }, add_msg_cb, move_cursor_cb)
    alreadyConnected = true
  }

  return (
    <div className="canvas">
      {/* <Sockets /> */}
      {contentReady && contentPermalink && (
        <div>
          <img src={`${contentPermalink}?${Date.now()}`}></img>
        </div>
      )}

      {
        // Create comment thread components from an array of comment data.
        messageThreadData.map((data) => (
          <CommentThread
            messageThreadData={data}
            addNewMessage={addNewMessage}
          ></CommentThread>
        ))
      }

      {displayOpenComment && (
        <Form
          onSubmit={handleCommentSubmit}
          style={{
            left: openCommentLeft,
            top: openCommentTop,
            position: 'absolute',
            outline: 'none',
          }}
        >
          <Form.Group controlId="formComment">
            <Form.Control
              type="text"
              placeholder="Comment..."
              value={openCommentText}
              onChange={handleCommentTextChange}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      )}

      <Form onSubmit={handleUrlSubmit}>
        <Form.Group controlId="formUrlInput">
          <Form.Label>Media Content URL</Form.Label>
          <Form.Control
            type="url"
            placeholder="URL"
            value={url}
            onChange={handleUrlChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>

      <div>url: {url}</div>

      <Form>
        <Form.Group controlId="formUrlInput">
          <Form.Label>User</Form.Label>
          <Form.Control
            type="text"
            placeholder="user name"
            value={user}
            onChange={handleUserChange}
          />
        </Form.Group>
      </Form>
    </div>
  )
}
