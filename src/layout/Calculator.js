import '../styles/calculator.css';
import React from 'react';
import Screen from './screen/Screen';
import Keypad from './keypad/Keypad';


const CalcOperations = {
    '+' : (previousValue, nextValue) => previousValue + nextValue,
    '-' : (previousValue, nextValue) => previousValue - nextValue,
    '*' : (previousValue, nextValue) => previousValue * nextValue,
    '/' : (previousValue, nextValue) => previousValue / nextValue,
    '=' : (previousValue, nextValue) => nextValue
};

class Calculator extends React.Component {

    state = {
        value: null,
        displayValue: '0',
        operator: null,
        waitingForNumber: false
    };

    //using component did update to fix the display value if the number on screen gets to be to large.
    //componentDidUpdate is perfect for this as it constantly keeps track of state.
    componentDidUpdate(prevProps, prevState) {
        if (prevState.displayValue !== this.state.displayValue) {
            let { displayValue } = this.state;
            displayValue = String(displayValue);
            //makes sure that if infinity is displayed that more digits don't appear
            if (displayValue.indexOf('Infinity') !== -1) {
                displayValue = 'Infinity';
            }
            if (displayValue.length > 10) {
                displayValue = parseFloat(displayValue).toPrecision(10);
            }
            this.setState({
                displayValue
            })
        }
    }

    clearAll = () => {
        this.setState({
            value: null,
            displayValue: '0',
            operator: null,
            waitingForNumber: false
        })
    };

    clearDisplay = () => {
        this.setState({
            displayValue: '0'
        })
    };

    toggleSign = () => {
        const { displayValue } = this.state;
        let oppositeValue = parseFloat(displayValue) * -1;
        oppositeValue = String(oppositeValue);
        this.setState({
            displayValue: oppositeValue
        })
    };

    percentInput = () => {
        const { displayValue, operator, value } = this.state;
        const currentValue = parseFloat(displayValue);
        let updatedValue;
        if (currentValue === 0) {
            return;
        }
        if (operator !== '+' && operator !== '-') {
            updatedValue = parseFloat(displayValue) / 100
        } else {
            updatedValue = (displayValue / 100) * value;
        }
        updatedValue = String(updatedValue);
        this.setState({
            displayValue : updatedValue
        })
    };

    decimalInput = () => {
        const { value, displayValue, waitingForNumber } = this.state;
        //check first to see if value is not equal to display value as in this case value starts at null. If they aren't equal
        //we check to see if a decimal already exists. if it doesn't we are then adding in a decimal
        debugger;
        if (value !== parseFloat(displayValue)  && displayValue.indexOf('.') === -1) {
            this.setState({
                displayValue: displayValue + '.',
                waitingForNumber: false
            })
        //if value is equal to the display value and we are waiting for the second number to be entered, we need to start it off with
        //a "0." because the decimal was clicked before a number.
        } else if ((value === parseFloat(displayValue) && waitingForNumber)) {
            this.setState({
                displayValue: '0.',
                waitingForNumber: false
            })
        }
    };

    digitInput = number => {
        const { displayValue, waitingForNumber } = this.state;
        if(waitingForNumber) {
            this.setState({
                displayValue: String(number),
                waitingForNumber: false
            })
        } else {
            this.setState({
                displayValue: displayValue === '0' ? String(number) : displayValue + number
            })
        }
    };

    doMath = nextOperator => {
        const { value, displayValue, operator, waitingForNumber} = this.state;
        const inputValue = parseFloat(displayValue);
        if (value == null) {
            this.setState({
                value: inputValue
            })
        } else if (operator && !waitingForNumber) {
            const currentValue = value || 0;
            const newValue = CalcOperations[operator](currentValue, inputValue);
            this.setState({
                value: newValue,
                displayValue: String(newValue)
            })
        }
        this.setState({
            waitingForNumber: true,
            operator: nextOperator
        })
    };

    render() {
        return (
            <main className="calculator">
                <Screen
                    result={this.state.displayValue}
                />
                <Keypad
                    clearAll = {this.clearAll}
                    clearDisplay = {this.clearDisplay}
                    toggleSign = {this.toggleSign}
                    percentInput = {this.percentInput}
                    decimalInput = {this.decimalInput}
                    digitInput = {this.digitInput}
                    doMath = {this.doMath}
                    displayValue = {this.state.displayValue}
                />
            </main>
        );
    }
}

export default Calculator;