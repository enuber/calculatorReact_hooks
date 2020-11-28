import '../../styles/resultScreen.css';
import React from 'react';

const resultScreen = (props) => {
    return (
        <div className="resultScreen">
            {props.children}
        </div>
    )
};

export default resultScreen;