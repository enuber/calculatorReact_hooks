import '../../styles/computationScreen.css';
import React from 'react';

const computationScreen = (props) => {
    return (
    <div className="computationScreen">
        {props.children}
    </div>
    )
};

export default computationScreen;