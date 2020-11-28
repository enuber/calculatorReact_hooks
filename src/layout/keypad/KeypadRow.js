import '../../styles/keypadRow.css';
import React from 'react';

const keypadRow = (props) => {
    return (
        <div className="keypadRow">
            {props.children}
        </div>
    )
};

export default keypadRow;