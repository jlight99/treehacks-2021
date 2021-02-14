import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import CommentThread from './Comment';
import Sockets from './Sockets';
import './Home.css';
import { connect_to_doc, add_msg, move_cursor } from './SocketAPIs';
import socketIOClient from 'socket.io-client';
import { BiPencil } from 'react-icons/bi';
import { BsFillCursorFill } from 'react-icons/bs';
import { StickyContainer, Sticky } from 'react-sticky';
import { getUserColour } from './Constants.js'
// import 'bootstrap/dist/css/bootstrap.min.css';

let alreadyConnected = false
// let mouseMoveCounter = 0
let socket = socketIOClient('ws://localhost:8080')

function Cursor(props) {
  const userColour = getUserColour(props.user)
  return (
    <div
      style={{
        position: 'absolute',
        // backgroundColor: 'black',
        left: props.pos[0] + 'px',
        top: props.pos[1] + 'px',
        borderRadius: '5px',
      }}
    >
      <BsFillCursorFill style={{fill: userColour}}/>
    </div>
  )
}

export default function Home(props) {
  const pagescreenApiUrl = 'https://api.pagescreen.io/v1/capture.json'
  const [url, setUrl] = useState('');
  const [user, setUser] = useState('Ellen');
  const [contentPermalink, setContentPermalink] = useState('');
  const [contentReady, setContentReady] = useState(false);
  const [editUrl, setEditUrl] = useState(true);
  const [openCommentTop, setOpenCommentTop] = useState(0);
  const [openCommentLeft, setOpenCommentLeft] = useState(0);
  const [openCommentText, setOpenCommentText] = useState('');
  const [displayOpenComment, setDisplayOpenComment] = useState(false);
  const [otherUserPos, setOtherUserPos] = useState([10, 10]);
  const [editUsername, setEditUsername] = useState(true);
  const [editUserBtnBgColour, setEditUserBtnBgColour] = useState('white');
  const [messageThreadData, setMessageThreadData] = useState([
    {
      left: 70,
      top: 450,
      message_thread_id: 'b',
      messages: [
        {
          user: 'Bimesh',
          timestamp: 1613281738,
          body: 'I think recycling reducing and resuing is not as important as dealing with carbon emissions etc. That’s why we should all start using Nuro! ',
        },
        {
          user: 'Robbie',
          timestamp: 1613281738,
          body: "Idk man, I think the 3 Rs are still pretty important...",
        },
      ],
    },
    {
      left: 900,
      top: 680,
      message_thread_id: 'c',
      messages: [
        {
          user: 'Ellen',
          timestamp: 1613281738,
          body:
            'This image is so representative of the issue with recycling across the world',
        },
      ],
    },
  ]);

  const addNewMessage = (newMessage) => {
    const threadIdx = messageThreadData.findIndex(
      (thread) => thread.message_thread_id == newMessage.message_thread_id,
    );
    // If the thread is found!
    if (threadIdx != -1) {
      let data = messageThreadData.concat();
      data[threadIdx].messages.push({
        user: user,
        timestamp: Date.now(),
        body: newMessage.body,
      });
      setMessageThreadData(data);
    } else if (newMessage.left && newMessage.top) {
      // If we are creating a new message
      setMessageThreadData(messageThreadData => [...messageThreadData, newMessage]);
    } else {
      console.log('Invalid new message', newMessage);
    }
  };

  useEffect(() => {
    document.addEventListener('dblclick', handleClick);
    return () => {
      document.removeEventListener('dblclick', handleClick);
    }
  }, []);

  /*
   * Upon user mouse click, open a textfield where they can type their comment.
   */
  const handleClick = (e) => {
    if (!displayOpenComment) {
      setOpenCommentLeft(e.pageX)
      setOpenCommentTop(e.pageY)
      setDisplayOpenComment(true)
    }
  };

  /*
   * Update the comment text as the user types to display their changes in real time.
   */
  const handleCommentTextChange = (event) => {
    setOpenCommentText(event.target.value)
  };

  const handleUserSubmit = (event) => {
    event.preventDefault();
    setEditUsername(false);
  };

  const updateReplyPosted = (msg) => {
    addNewMessage(msg);
    add_msg(socket, {
      user: user,
      timestamp: Date.now(),
      body: msg.body,
      message_thread_id: msg.message_thread_id,
    });
  }

  /*
   * Send the comment data to the server in order to create a new comment.
   */
  const handleCommentSubmit = (event) => {
    event.preventDefault();
    const id = (+new Date()).toString(36);
    const timestamp = Date.now();
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
    };
    addNewMessage(localMessage);
    setDisplayOpenComment(false);
    add_msg(socket, {
      user: user,
      body: openCommentText,
      message_thread_id: id,
      x: openCommentLeft,
      y: openCommentTop,
      timestamp: +new Date(),
    });
    setOpenCommentText('');
  };

  /*
   * Update the input URL as the user types to display their changes in real time.
   */
  const handleUrlChange = (event) => {
    setUrl(event.target.value)
  };

  const handleUserChange = (event) => {
    setUser(event.target.value)
  };

  const handleEditUserClick = (event) => {
    setEditUsername(true);
  };

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
        fullpage: true,
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
          setContentReady(true);
        }, millisecondsToWait);
        setEditUrl(false);
      })
      .catch((err) => console.log(err))
  }

  const handleMouseMove = (e) => {
    // if (mouseMoveCounter > 5) {
    console.log(e.clientX, e.clientY)
    move_cursor(socket, { user: user, x: e.clientX, y: e.clientY })
    //   mouseMoveCounter = 0
    // }
    // mouseMoveCounter++
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
  };

  const handleEditUrlClick = () => {
    setEditUrl(true);
  };

  // We can currently only see one other user cursor
  // TODO: make compatible for multi-user
  const move_cursor_cb = (pos) => {
    // console.log('pos:', pos)
    // if (pos.user === user) {
    //   return
    // }
    setOtherUserPos([pos.x, pos.y])
    // console.log('updated pos', otherUserPos)
  }

  useEffect(() => {
    console.log('Send info')
    connect_to_doc(socket, { url: url, user: user }, add_msg_cb, move_cursor_cb)
  }, [url, user])

  return (
    <div className="canvas" onMouseMove={handleMouseMove}>
      {/* <div style={{ fontSize: '48px' }}>Convo</div> */}
      {<Cursor pos={otherUserPos} user={user}/>}
      {
        // Create comment thread components from an array of comment data.
        messageThreadData.map((data) => (
          <CommentThread
            messageThreadData={data}
            addNewMessage={updateReplyPosted}
          ></CommentThread>
        ))
      }

      <div className="topSidebar">
        <div style={{ padding: '5px' }}>
          <img src="Robbie.svg"></img>
        </div>
        <div style={{ padding: '5px' }}>
          <img src="AsianDude.svg"></img>
        </div>
      </div>

      {editUsername &&
        <Form onSubmit={handleUserSubmit}>
          <Form.Group controlId="formUrlInput">
            <Form.Label style={{ paddingRight: '5px' }}>User</Form.Label>
            <Form.Control
              type="text"
              placeholder="user name"
              value={user}
              onChange={handleUserChange}
            />
          </Form.Group>
        </Form>
      }
      {!editUsername &&
        <div>
          <span>User: {user}</span>
          <Button style={{ border: 'none', backgroundColor: editUserBtnBgColour, borderColor: 'blue' }} className="editUserBtn" onClick={handleEditUserClick}><BiPencil /></Button>
        </div>
      }

      {editUrl && <Form onSubmit={handleUrlSubmit}>
        <Form.Group controlId="formUrlInput">
          <Form.Label style={{ paddingRight: '5px' }}>Media Content URL</Form.Label>
          <Form.Control
            type="url"
            placeholder="URL"
            value={url}
            onChange={handleUrlChange}
          />
        </Form.Group>
      </Form>}
      {!editUrl &&
        <div>
          <span>Media Content URL: {url}</span>
          <Button style={{ border: 'none', backgroundColor: editUserBtnBgColour, borderColor: 'blue' }} className="editUserBtn" onClick={handleEditUrlClick}><BiPencil /></Button>
        </div>
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
        </Form>
      )}

      {contentReady && contentPermalink && (
        <div>
            <img src={`${contentPermalink}`}></img>
          {/* <img src={`${contentPermalink}?${Date.now()}`}></img> */}
        </div>
      )}
    </div>);
}
