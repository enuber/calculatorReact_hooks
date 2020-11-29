import '../styles/calculator.css';
import React, { useState, useEffect } from 'react';
import Screen from './screen/Screen';
import Keypad from './keypad/Keypad';


const CalcOperations = {
    '+' : (previousValue, nextValue) => previousValue + nextValue,
    '-' : (previousValue, nextValue) => previousValue - nextValue,
    '*' : (previousValue, nextValue) => previousValue * nextValue,
    '/' : (previousValue, nextValue) => previousValue / nextValue,
    '=' : (previousValue, nextValue) => nextValue
};

const Calculator = () => {

    const [value, setValue] = useState(null);
    const [displayValue, setDisplayValue] = useState('0');
    const [operator, setOperator] = useState(null);
    const [waitingForNumber, setWaitingForNumber] = useState(false);

    //using a useEffect to watch the displayValue if the number on screen gets to be to large.
    //or if it ever equals infinity so you can't add numbers ot infinity
    useEffect(()=>{
        if (displayValue.indexOf('Infinity') !== -1) {
            setDisplayValue('Infinity');
        }
        if (displayValue.length > 10) {
            setDisplayValue(parseFloat(displayValue).toPrecision(10));
        }
    },[displayValue]);

    const clearAll = () => {
        setValue(null);
        setDisplayValue('0');
        setOperator(null);
        setWaitingForNumber(false);
    };

    const clearDisplay = () => {
        setDisplayValue('0');
    };

    const toggleSign = () => {
        let oppositeValue = parseFloat(displayValue) * -1;
        oppositeValue = String(oppositeValue);
        setDisplayValue(oppositeValue);
    };

    const percentInput = () => {
        const currentValue = parseFloat(displayValue);
        let updatedValue;
        if (currentValue === 0) {
            return;
        }
        if (operator !== '+' && operator !== '-') {
            updatedValue = parseFloat(displayValue) / 100
        } else {
            updatedValue = (displayValue / 100) * {value};
        }
        updatedValue = String(updatedValue);
        setDisplayValue(updatedValue);
    };

    const decimalInput = () => {
        //check first to see if value is not equal to display value as in this case value starts at null. If they aren't equal
        //we check to see if a decimal already exists. if it doesn't we are then adding in a decimal
        if (value !== parseFloat(displayValue)  && displayValue.indexOf('.') === -1) {
            setDisplayValue(`${displayValue}.`);
            setWaitingForNumber(false);
        //if value is equal to the display value and we are waiting for the second number to be entered, we need to start it off with
        //a "0." because the decimal was clicked before a number.
        } else if ((value === parseFloat(displayValue) && waitingForNumber)) {
            setDisplayValue(`0.`);
            setWaitingForNumber(false);
        }
    };

    const digitInput = number => {
        if(waitingForNumber) {
            setDisplayValue(String(number));
            setWaitingForNumber(false);
        } else {
            setDisplayValue(displayValue === '0' ? String(number) : displayValue + number);
        }
    };

    const doMath = nextOperator => {
        const inputValue = parseFloat(displayValue);
        if (value == null) {
            setValue(inputValue);
        } else if (operator && !waitingForNumber) {
            const currentValue = value || 0;
            const newValue = CalcOperations[operator](currentValue, inputValue);
            setValue(newValue);
            setDisplayValue(String(newValue));
        }
        setWaitingForNumber(true);
        setOperator(nextOperator);
    };

    return (
        <main className="calculator">
            <Screen
                result={displayValue}
            />
            <Keypad
                clearAll = {clearAll}
                clearDisplay = {clearDisplay}
                toggleSign = {toggleSign}
                percentInput = {percentInput}
                decimalInput = {decimalInput}
                digitInput = {digitInput}
                doMath = {doMath}
                displayValue = {displayValue}
            />
        </main>
    );
};

export default Calculator;