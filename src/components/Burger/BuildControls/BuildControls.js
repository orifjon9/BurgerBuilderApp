import React from 'react';

import classes from './BuildControls.css';
import BuildControl from './BuildControl/BuildControl';

const controls = [
    { label: 'Salad', type: 'salad' },
    { label: 'Bacon', type: 'bacon' },
    { label: 'Cheese', type: 'cheese' },
    { label: 'Meat', type: 'meat' }
];

const buildControls = (props) => {

    const purchaseable = Object.values(props.disabled).reduce((prev, curr) => {
        return prev || !curr;
    }, false);

    return <div className={classes.BuildControls}>
        <p>Current Price: <strong>${props.price.toFixed(2)}</strong></p>
        {
            controls.map((ctrl) => (
                <BuildControl
                    label={ctrl.label}
                    key={ctrl.label}
                    added={() => props.ingredientAdded(ctrl.type)}
                    removed={() => props.ingredientRemoved(ctrl.type)}
                    disabled={props.disabled[ctrl.type]} />
            ))
        }
        <button
            className={classes.OrderButton}
            disabled={!purchaseable}
            onClick={props.ordered}> {props.isAuth ? 'ORDER NOW': 'SIGN UP TO ORDER'}</button>
    </div>
};

export default buildControls;