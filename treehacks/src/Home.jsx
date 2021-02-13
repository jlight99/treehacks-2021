import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';

export default function Home(props) {
    const pagescreenApiUrl = 'https://api.pagescreen.io/v1/capture.json';
    const [url, setUrl] = useState('');
    const [contentPermalink, setContentPermalink] = useState('');
    const [contentReady, setContentReady] = useState(false);

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
            <h3>Social Media Paradigm Shift</h3>
            <div>content discussion-based social media</div>

            {contentReady && contentPermalink &&  
                <div>
                    {/* <p>potato</p> */}
                    <img src={`${contentPermalink}?${Date.now()}`}></img>
                </div>
            }

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
