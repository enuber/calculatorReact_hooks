import '../../styles/screen.css';
import React from 'react';
import ResultScreen from './ResultScreen';
// import ComputationScreen from './ComputationScreen';

const screen = (props) => {
    return(
    <section className="screen">
        <ResultScreen>{props.result}</ResultScreen>
    </section>
    )
};

export default screen;