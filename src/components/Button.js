import '../styles/button.css';
import React from 'react';

const button = (props) => {
    const setClass = ['btn'];

    if (typeof props !== 'undefined' && typeof props.type !== 'undefined') {
        setClass.push('btn' + props.type);
    }

    return (
        <button className={setClass.join(' ')} onClick={props.onButtonPress}>
            {props.children}
        </button>
    )
};

export default button;