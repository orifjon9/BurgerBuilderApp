import React from 'react';

import classes from './Burger.css';

import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burger = (props) => {
    let transformedIngredients = Object.keys(props.ingredients)
        .map(idKey => {
            return [...Array(props.ingredients[idKey])].map((_, i) => <BurgerIngredient key={idKey + i} type={idKey} />);
        })
        .reduce((arr, el) =>  arr.concat(el), []);
        
        if(transformedIngredients.length === 0){
            transformedIngredients = <p>Please start adding ingredients</p>;
        }

    return (
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top" />
            {transformedIngredients}
            <BurgerIngredient type="bread-bottom" />
        </div>
    );
}

export default burger;
