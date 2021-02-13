import React, { useState } from 'react';
import './Comment.css';

export default function Home(props) {
    const [id, setId] = useState(props.id);
    const [top, setTop] = useState(props.top);
    const [left, setLeft] = useState(props.left);
    const [text, setText] = useState(props.text);

    return (
        <span className="comment" style={{left: left + 'px', top: top + 'px', position: 'absolute'}}>
            {text}
        </span>
    );
}
