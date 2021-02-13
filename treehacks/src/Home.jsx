import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import Comment from './Comment';
import useWebSocket, { ReadyState } from 'react-use-websocket';

export default function Home(props) {
    const pagescreenApiUrl = 'https://api.pagescreen.io/v1/capture.json';
    const [url, setUrl] = useState('');
    const [contentPermalink, setContentPermalink] = useState('');
    const [contentReady, setContentReady] = useState(false);
    const [socketUrl, setSocketUrl] = useState('ws://localhost/:8765');
    const messageHistory = useRef([]);
    
    const {
      sendMessage,
      lastMessage,
      readyState,
    } = useWebSocket(socketUrl);

    messageHistory.current = useMemo(() =>
      messageHistory.current.concat(lastMessage),[lastMessage]);
  
    const handleClickChangeSocketUrl = useCallback(() =>
      setSocketUrl('ws://localhost/:8765'), []);
  
    const handleClickSendMessage = useCallback(() =>
      sendMessage('Hello'), []);
  
    const connectionStatus = {
      [ReadyState.CONNECTING]: 'Connecting',
      [ReadyState.OPEN]: 'Open',
      [ReadyState.CLOSING]: 'Closing',
      [ReadyState.CLOSED]: 'Closed',
      [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    const commentData = [
        {
            "id": 1,
            "left": 300,
            "top": 420,
            "text": "cookie you're a footer",
        },
        {
            "id": 2,
            "left": 250,
            "top": 225,
            "text": "random guy on reddit",
        },
        {
            "id": 3,
            "left": 420,
            "top": 380,
            "text": "full stack 2nd coop by the way",
        },
    ];

    const commentItems = commentData.map((data) =>
        <Comment
            key={data.id}
            id={data.id}
            left={data.left}
            top={data.top}
            text={data.text}
        ></Comment>
    );

    const handleClick = e => {
        console.log("clicked");
        console.log(e);
    };

    useEffect(() => {
        document.addEventListener("click", handleClick);
    
        return () => {
          document.removeEventListener("click", handleClick);
        };
    });

    const handleUrlChange = event => {
        setUrl(event.target.value);
    };

    const handleSubmit = event => {
        event.preventDefault();
        console.log('sending axios request');
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
        .then(data => {
            console.log(data);
            if (data.data.data[0]) {
                setContentPermalink(data.data.data[0].permalink);
            } else {
                setContentPermalink(data.data.data.permalink);
            }

            var millisecondsToWait = 2000;
            setTimeout(function() {
                setContentReady(true);
            }, millisecondsToWait);
        })
        .catch(err => console.log(err));
    };

    return (
        <div style={{ margin: '3%' }}>
            <div>
                <button
                    onClick={handleClickChangeSocketUrl}
                >
                    Click Me to change Socket Url
                </button>
                <button
                    onClick={handleClickSendMessage}
                    disabled={readyState !== ReadyState.OPEN}
                >
                    Click Me to send 'Hello'
                </button>
                <span>The WebSocket is currently {connectionStatus}</span>
                {lastMessage ? <span>Last message: {lastMessage}</span> : null}
            </div>
            <h3>Social Media Paradigm Shift</h3>
            <div>content discussion-based social media</div>

            {contentReady && contentPermalink &&  
                <div>
                    <img src={`${contentPermalink}?${Date.now()}`}></img>
                </div>
            }

            {commentItems}

            <Form onSubmit={handleSubmit}>
                <Form.Group controlId='formBasicEmail'>
                    <Form.Label>Media Content URL</Form.Label>
                    <Form.Control
                        type='url'
                        placeholder='URL'
                        value={url}
                        onChange={handleUrlChange}
                    />
                </Form.Group>

                <Button variant='primary' type='submit'>
                    Submit
                </Button>
            </Form>

            <div>url: {url}</div>
        </div>
    );
}
