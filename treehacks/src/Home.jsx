import React from 'react';
import Button from 'react-bootstrap/Button';
import Dropzone from './Dropzone.jsx';

export default function Home(props) {
    return (
        <div style={{ margin: '3%' }}>
            <h3>Social Media Paradigm Shift</h3>
            <div>content discussion-based social media</div>
            <Button>
                import image
            </Button>
            <Dropzone></Dropzone>
        </div>
    );
}
