import React from 'react';

import Aux from '../../../hoc/Auxiliary';

const orderSummary = (props) => {
    const ingredientsSummary = Object.keys(props.ingredients)
        .map((key) => {
            return (
                <li key={key}> 
                    <span style={{textTransform: 'capitalize'}}>{key}</span>: {props.ingredients[key]}
                </li>);
        });

    return <Aux>
        <h3>Your Order</h3>
        <p>A delicious burger with the following ingredients:</p>
        <ul>
            {ingredientsSummary}
        </ul>
        <p>Continue with Checkout?</p>
    </Aux>
};

export default orderSummary;