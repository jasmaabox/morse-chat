import React, { useState, useEffect } from 'react';

let isKeyDown = false;
let nowDown, nowUp;
let buffer = [];

const DOT_WAIT = 100;
const DASH_WAIT = 400;
const SPACE_WAIT = 300;
const SEND_WAIT = 600;

let timer;

/**
 * Morse code clicker
 * @param {*} props 
 */
const Clicker = props => {

    const { sendChannel, updateLog } = props;

    const [message, setMessage] = useState('');


    useEffect(() => {
        document.addEventListener("keydown", e => {
            if (e.keyCode === 32 && !isKeyDown) {
                isKeyDown = true;

                nowDown = new Date();
                const diff = nowDown - nowUp;

                if (diff > SPACE_WAIT) {
                    buffer.push(' ');
                    setMessage(data => data + ' ');
                }
            }
        }, false);
        document.addEventListener("keyup", e => {
            if (e.keyCode === 32) {
                isKeyDown = false;

                nowUp = new Date();
                const diff = nowUp - nowDown;

                if (diff < DOT_WAIT) {
                    buffer.push('.');
                    setMessage(data => data + '.');
                } else if (diff < DASH_WAIT) {
                    buffer.push('-');
                    setMessage(data => data + '-');
                }
            }

            // Debounce send
            clearTimeout(timer);
            timer = setTimeout(() => {

                const bufferMsg = buffer.join('');

                if (sendChannel.readyState === 'open') {

                    sendChannel.send(bufferMsg);

                    buffer = [];
                    setMessage('');
                    updateLog(`>= ${bufferMsg}`)
                }
            }, SEND_WAIT);

        }, false);
    }, []);

    return (
        <div className="d-flex flex-column">

            <h2>{message}</h2>
            <p>Type your message using SPACE</p>
        </div>
    );
}

export default Clicker;