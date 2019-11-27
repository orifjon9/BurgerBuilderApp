import React from 'react';

import classes from './Input.css';

const input = (props) => {
    let inputElement = null;

    switch (props.elementType) {
        case ('textarea'): {
            inputElement = <textarea
                className={classes.InputElement}
                {...props.elementConfig}
                value={props.value} onChange={props.changed} />;
        } break;
        case ('select'): {
            inputElement = <select value={props.value} className={classes.InputElement} onChange={props.changed}>
                {
                    props.elementConfig.options.map(option => <option value={option.value}>{option.displayValue}</option>)
                }
            </select>;
        } break;
        case ('input'):
        default: {
            inputElement = <input
                className={classes.InputElement}
                {...props.elementConfig}
                value={props.value} onChange={props.changed}/>;
        } break;
    }

    return (
        <div className={classes.Input}>
            <label className={classes.Label}>{props.label}</label>
            {inputElement}
        </div>);
};

export default input;