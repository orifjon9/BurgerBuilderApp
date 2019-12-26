import React from 'react';

import classes from './Input.css';

const input = (props) => {
    let inputElement = null;
    let inputClassess = [classes.InputElement];
    let validateError = null;
    
    if(props.invalid) {
        inputClassess.push(classes.Invalid);
        validateError = <p className={classes.ValidationError}>Please enter a valid value!</p>
    }

    switch (props.elementType) {
        case ('textarea'): {
            inputElement = <textarea
                className={inputClassess.join(' ')}
                {...props.elementConfig}
                value={props.value} onChange={props.changed} />;
        } break;
        case ('select'): {
            inputElement = <select value={props.value} className={inputClassess.join(' ')} onChange={props.changed}>
                {
                    props.elementConfig.options.map(option => <option key={option.value} value={option.value}>{option.displayValue}</option>)
                }
            </select>;
        } break;
        case ('input'):
        default: {
            inputElement = <input
                className={inputClassess.join(' ')}
                {...props.elementConfig}
                value={props.value} onChange={props.changed}/>;
        } break;
    }

    return (
        <div className={classes.Input}>
            <label className={classes.Label}>{props.label}</label>
            {inputElement}
            {validateError}
        </div>);
};

export default input;