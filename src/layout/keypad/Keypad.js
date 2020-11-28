import '../../styles/keypad.css';
import React from 'react';
import KeypadRow from './KeypadRow';
import Button from '../../components/Button';

const keypad = (props) => {

    const { displayValue } = props;
    const checkClearMethod = displayValue === '0';
    const clearText = checkClearMethod ? 'CE' : 'C';

    return(
        <section className="keypad">
            <KeypadRow>
                <Button onButtonPress={() => checkClearMethod ? props.clearAll() : props.clearDisplay()}>{clearText}</Button>
                <Button onButtonPress={() => props.toggleSign()}>±</Button>
                <Button onButtonPress={() => props.percentInput()}>%</Button>
                <Button type="Orange" onButtonPress={() => props.doMath('/')}>÷</Button>
            </KeypadRow>
            <KeypadRow>
                <Button onButtonPress={() => props.digitInput(7)}>7</Button>
                <Button onButtonPress={() => props.digitInput(8)}>8</Button>
                <Button onButtonPress={() => props.digitInput(9)}>9</Button>
                <Button type="Orange" onButtonPress={() => props.doMath('*')}>x</Button>
            </KeypadRow>
            <KeypadRow>
                <Button onButtonPress={() => props.digitInput(4)}>4</Button>
                <Button onButtonPress={() => props.digitInput(5)}>5</Button>
                <Button onButtonPress={() => props.digitInput(6)}>6</Button>
                <Button type="Orange" onButtonPress={() => props.doMath('-')}>—</Button>
            </KeypadRow>
            <KeypadRow>
                <Button onButtonPress={() => props.digitInput(1)}>1</Button>
                <Button onButtonPress={() => props.digitInput(2)}>2</Button>
                <Button onButtonPress={() => props.digitInput(3)}>3</Button>
                <Button type="Orange" onButtonPress={() => props.doMath('+')}>+</Button>
            </KeypadRow>
            <KeypadRow>
                <Button type="Large" onButtonPress={() => props.digitInput(0)}>0</Button>
                <Button onButtonPress={() => props.decimalInput()}>.</Button>
                <Button type="Orange" onButtonPress={() => props.doMath('=')}>=</Button>
            </KeypadRow>
        </section>
    )
};

export default keypad;