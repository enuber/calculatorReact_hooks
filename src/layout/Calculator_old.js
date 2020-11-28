import '../styles/calculator.css';
import React from 'react';
import Screen from './screen/Screen';
import Keypad from './keypad/Keypad';

class Calculator extends React.Component {

    //keeping track of full equation for display purposes.
    //currentNumber is number being typed in. currentOperator is the operator last pressed,
    //originalNumber is the number that was first entered before the percent or operator was entered
    state = {
        equation: '',
        currentNumber: '',
        currentOperator: '',
        decimalExist: false,
        operatorClicked: false,
        percentClicked: false,
        equalClicked: false,
        calculationMade: false,
        originalNumber: '',
        displayValue: 0
    };

    //using component did update to fix the display value if the number on screen gets to be to large.
    //rather than using it to update the display value regardless of process used doing it this way because
    //the display value has to many variables that change what is displayed.
    componentDidUpdate(prevProps, prevState) {
        let displayValue = this.state.displayValue.toString();
        if (prevState.displayValue !== this.state.displayValue) {
            if (displayValue.length > 10) {
                displayValue = parseFloat(displayValue).toExponential(5)
            }
            this.setState({displayValue});
        }
    }

    onButtonPress = evt => {
        let equation = this.state.equation;
        let currentNumber = this.state.currentNumber;
        const pressedButton = evt.target.innerHTML;
        if (pressedButton === 'CE') {
            return this.clear();
        } else if ((pressedButton >= '0' && pressedButton <= '9') || pressedButton === '.') {
            if (!this.state.percentClicked) {
                return this.acceptNumOrDec(pressedButton);
            }
        } else if (['+', '-', '*', '/'].indexOf(pressedButton) !== -1) {
            if (this.state.currentNumber === '' && this.state.originalNumber === "") {
                return;
            } else {
                this.setState({
                    percentClicked: false
                }, () => {
                    return this.acceptOperator(pressedButton);
                });
            }
        } else if (['%'].indexOf(pressedButton) !== -1) {
            if (!this.state.percentClicked) {
                return this.percentage();
            }
        } else if (pressedButton === '=') {
            try {
                this.setState({
                    equalClicked: true,
                    percentClicked: false
                }, () => {
                    if (!this.state.operatorClicked) {
                        this.doMath()
                    }
                });
            } catch (error) {
                alert('Not A Valid Equation');
                return this.clear();
            }
        }  else {
            this.removeLast();
        }
        this.setState({
            equation,
            currentNumber
        });
    };

    acceptNumOrDec = async (input) => {
        //deals with the case where the equal sign was hit and then immediately a new number. Here we clear
        //it out and reset everything before moving on.
        if (this.state.calculationMade) {
            await this.clear();
        }
        //Here we deal with the fact an operator was clicked so now we need to start a new number and
        //put the previous number into it's own placeholder. If/else in this case deals with whether the
        //"orignalNumber" which is the placeholder has content or not. If it doesn't, we move the current
        //number into it's place and empty out the current number so we can store the new info. If
        //originalNumber has content, it means that the percent sign had been clicked as well as an operator
        //and now we just need to prepare for the new number
        if (this.state.operatorClicked) {
            if (this.state.originalNumber === '') {
                await this.setState( state => ({
                    currentNumber: '',
                    originalNumber: this.state.currentNumber,
                    operatorClicked: false,
                    displayValue: input
                }));
            } else {
                await this.setState({
                    currentNumber: '',
                    operatorClicked: false,
                    displayValue: input
                });
            }
        }
        let equation = this.state.equation;
        let currentNumber = this.state.currentNumber;
        //checks to see whether a decimal already exists. This keeps someone from putting in a decimal
        //multiple times whichs should not be allowed. This if statement here begins with making sure a
        //decimal doesn't already exist
        if (!this.state.decimalExist) {
            if (input === '.') {
                //adding on a zero before the decimal if decimal is the first button pushed in a new number
                if (currentNumber === '') {
                    equation += '0.';
                    currentNumber += '0.'
                } else {
                    equation += input;
                    currentNumber += input;
                }
                this.setState({
                    equation,
                    currentNumber,
                    decimalExist: true,
                    displayValue: currentNumber
                });
                //if it's just a number than we are updating the info with just a number.
            } else {
                equation += input;
                currentNumber += input;
                this.setState({
                    equation,
                    currentNumber,
                    displayValue: currentNumber
                })
            }
            //this is the case where a decimal does exist and we need to make sure that the input is
            //not another decimal.
        } else if (this.state.decimalExist && !isNaN(input)) {
            equation += input;
            currentNumber += input;
            this.setState({
                equation,
                currentNumber,
                displayValue: currentNumber
            })
        }
    };

    acceptOperator = async (operator) => {
        //this checks to see if the equal sign was clicked followed by an operator. In this case we need to
        //reset the current number to match the result which is on display and, reset the original number. It
        //wiil allow additional math to be performed based on the result gotten by clicking equal.
        if (this.state.calculationMade) {
            let currentNumber = this.state.displayValue;
            await this.setState({
                currentNumber,
                originalNumber: '',
                calculationMade: false,
            })
        }
        //this if statement deals with the case where we are doing mulitple operations before clicking equal.
        //example 1 + 3 * 5. This keeps up with the additional operators by completing the math on the first
        //two numbers with the operator. By setting equalClicked to false, we are setting up doMath to know that
        //equal wasn't actually clicked so it can do the math and come back here properly set up for the
        //next equation.
        if (this.state.currentNumber !== '' && this.state.originalNumber !== ''
            && this.state.currentOperator !== '') {
            await this.setState({
                equalClicked: false,
            }, () => this.doMath());
        }
        let equation = this.state.equation;
        //this cleans up the current operator in the equation if you go from one operator immediately
        //to another operator. For example click + when you meant to click on *. Need to remove
        //it from the equation view and reset it.
        if (this.state.operatorClicked) {
            equation = equation.trim();
            equation = equation.substr(0, equation.length -1);
        }
        equation += ` ${operator} `;
        this.setState({
            equation,
            currentOperator: operator,
            decimalExist: false,
            operatorClicked: true,
            calculationMade: false,
        })
    };

    percentage = async () => {
        let displayValue;
        let equation;
        let percentClicked: false;
        debugger;
        // makes a check to be sure a number exists and that it isn't 0 before applying a percantage.
        if (this.state.currentNumber !== '' && parseFloat(this.state.currentNumber) !== 0) {
            if (!this.state.operatorClicked) {
                equation = this.state.equation + '%';
            } else {
                equation = `${this.state.equation} ${this.state.currentNumber}%`;
            }
            let currentNumber = this.state.currentNumber;
            if (this.state.currentOperator === '*' || this.state.currentOperator === "/" || this.state.originalNumber === '') {
                displayValue = currentNumber / 100;
            } else {
                displayValue = (currentNumber / 100) * this.state.originalNumber;
            }
            percentClicked = true;
            //if there is nothing there than we need to ignore that the percent was clicked and leave the
            //function
        } else if (this.state.currentNumber === '' && this.state.originalNumber !== '') {
            equation = `${this.state.equation} ${this.state.originalNumber*100}%`;
            displayValue = (((this.state.originalNumber * 100) / 100) * this.state.originalNumber);
        } else {
            await this.setState(state => ({
                equation : state.equation,
                displayValue : 0,
                percentClicked : false
            }));
            return;
        }
        //in order to set thngs up properly, you have to check where in the math the percent has been placed
        //so we check to see if there is already a number in originalNumber or not. If there is no number
        //that already exists, we know that the percent will be on the first number and, have to set it up
        //so that only an operator can now be clicked. We put the number with the percentage math done into the
        //originalNumber, reset currentNumber to nothing. Otherwise, it means that the percentage math
        //was done to the second number in which case, we leave the originalNumber alone and set the
        //currentNumber to the number gotten after the perentage math was done to it.
        if (this.state.originalNumber === '') {
            await this.setState({
                // currentNumber: '',
                originalNumber: displayValue,
                equation,
                displayValue,
                percentClicked,
                operatorClicked: false
            });
        } else {
            await this.setState({
                currentNumber: displayValue,
                equation,
                displayValue,
                percentClicked,
                operatorClicked: false
            });
        }
    };

    doMath = async () => {
        let {currentOperator, equation} = this.state;
        let displayValue;
        //extricated the percentage as an operator because it simplified the actual math portion of
        //the calculator.
        switch (currentOperator) {
            case '+':
                displayValue = parseFloat(this.state.originalNumber) + parseFloat(this.state.currentNumber);
                break;
            case '-':
                displayValue = this.state.originalNumber - this.state.currentNumber;
                break;
            case '*':
                displayValue = this.state.originalNumber * this.state.currentNumber;
                break;
            case '/':
                //division is most complicated because you can't divide a number by 0. So here we
                //are making sure the actual number versus a string is not equal to 0. This makes sure
                //of the case where 000000 = 0 is actually true. In a string they would not be true.
                if (parseFloat(this.state.currentNumber) !== 0) {
                    let currentNumber = this.state.currentNumber || this.state.originalNumber;
                    displayValue = this.state.originalNumber/currentNumber;
                } else {
                    displayValue = "Not A Number"
                }
                break;
            default:
                displayValue = this.state.displayValue;
                break;
        }
        //here we check to see if equal was clicked or, if math was being done because an operator had
        //been clicked. If the operator is clicked. If the equal sign was clicked, we need to be ready
        //to make sure the operation can continue if the equal sign is hit mulitple times. So it will perform
        //the last calculation again and again. Thus we put the number on screen into the originalNumbers
        //location. If the equal sign was not clicked, we then are setting the current Number to the result and
        //emptying the original Number so that math may then continue to be performed correctly.
        equation += ` = ${displayValue} `;
        if (this.state.equalClicked) {
            await this.setState({
                equation,
                currentOperator,
                calculationMade: true,
                originalNumber: displayValue,
                displayValue
            });
        } else {
            await this.setState({
                equation,
                currentNumber: displayValue,
                currentOperator,
                calculationMade: false,
                originalNumber: '',
                displayValue
            })
        }
    };

    removeLast = async () => {
        let equation = this.state.equation.split(' ');
        const lengthArr = equation.length;
        equation.pop();
        equation = equation.join(' ');
        if (lengthArr === 3) {
            await this.setState({
                equation,
                currentNumber: '',
                displayValue: 0
            });
            return;
        } else if (lengthArr === 2) {
            await this.setState(state => ({
                equation,
                currentOperator: '',
                displayValue: state.originalNumber
            }));
            return
        }
        this.clear();
    };

    //resets the entire state if the clear was clicked.
    clear = () => {
        this.setState({
            equation: '',
            currentNumber: '',
            currentOperator: '',
            decimalExist: false,
            operatorClicked: false,
            percentClicked: false,
            equalClicked: false,
            calculationMade: false,
            originalNumber: '',
            displayValue: 0
        })
    };

    render() {
        return (
            <main className="calculator">
                <Screen
                    equation={this.state.equation}
                    result={this.state.displayValue}
                />
                <Keypad
                    onButtonPress={this.onButtonPress}
                />
            </main>
        );
    }
}

export default Calculator;