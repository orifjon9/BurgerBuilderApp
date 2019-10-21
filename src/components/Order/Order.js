import React from 'react';

import classes from './Order.css';

const order = (props) => {

    let ingredients = [];
    for (let key in props.order.ingredients) {
        ingredients.push({
            name: key,
            amount: props.order.ingredients[key]
        });
    }

    const ingredientsOutput = ingredients.map(ig => (
        <span 
            style={{
                textTransform: 'capitalize',
                display: 'inline-block',
                margin: '0 8px',
                border: '1px solid #ccc',
                padding: '5px'
            }}
            key={ig.name}
            >{ig.name} ({ig.amount})</span>
    ));

    return (
        <div className={classes.Order}>
            <p>Ingredients: {ingredientsOutput}</p>
            <p>Price: <strong>USD {Number.parseFloat(props.order.price).toFixed(2)}</strong></p>
            <p>Created: {props.order.createdOn}</p>
        </div>
    )
};

export default order;