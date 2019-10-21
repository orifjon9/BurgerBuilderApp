import React from 'react';

import classes from './Input.css';

const input = (props) => {
    let inputElement = null;

    switch (props.inputtype) {
        case ('textarea'): {
            inputElement = <textarea className={classes.InputElement} {...props} />;
        } break;
        case ('input'):
        default: {
            inputElement = <input className={classes.InputElement} {...props} />;
        } break;
    }

    return (
        <div className={classes.Input}>
            <label className={classes.Label}>{props.label}</label>
            {inputElement}
        </div>);
};

export default input;