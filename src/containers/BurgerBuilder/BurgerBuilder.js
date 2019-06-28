import React, { Component } from 'react';

import Aux from '../../hoc/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';

const ingredientsPrice = {
    salad: 0.4,
    bacon: 0.7,
    cheese: 0.3,
    meat: 1.4
};

class BurgerBuilder extends Component {
    state = {
        ingredients: {
            salad: 0,
            bacon: 0,
            cheese: 0,
            meat: 0
        },
        totalPrice: 0,
        purchasing: false
    }

    addIngredientHandler = (type) => {
        const updatedIngredients = { ...this.state.ingredients };
        const updatedIngredientCount = updatedIngredients[type] + 1;
        updatedIngredients[type] = updatedIngredientCount;

        this.setState({ ingredients: updatedIngredients, totalPrice: this.getTotalPrice(updatedIngredients) });
    }

    removedIngredientHandler = (type) => {
        const updatedIngredients = { ...this.state.ingredients };
        const oldIngredientCount = updatedIngredients[type];

        if (oldIngredientCount > 0) {
            updatedIngredients[type] = oldIngredientCount - 1;
            this.setState({ ingredients: updatedIngredients, totalPrice: this.getTotalPrice(updatedIngredients) });
        }
    }

    getTotalPrice = (ingredients) => {
        return Object.keys(ingredients)
            .map((key) => ingredients[key] * ingredientsPrice[key])
            .reduce((prev, curr) => prev + curr);
    };

    purchaseHandler = () => {
        this.setState({ purchasing: true });
    };

    purchaseCancelHandler = () => {
        this.setState({ purchasing: false });
    };

    purchaseContinueHandler = () => {
        alert('You continued!')
    };

    render() {
        const disabledInfo = { ...this.state.ingredients };
        Object.keys(disabledInfo).forEach(key => {
            disabledInfo[key] = (disabledInfo[key] === 0)
        });

        return <Aux>
            <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                <OrderSummary
                    ingredients={this.state.ingredients}
                    price={this.state.totalPrice}
                    purchaseCancelled={this.purchaseCancelHandler}
                    purchaseContinued={this.purchaseContinueHandler}
                />
            </Modal>
            <Burger ingredients={this.state.ingredients} />
            <BuildControls
                ingredientAdded={this.addIngredientHandler}
                ingredientRemoved={this.removedIngredientHandler}
                disabled={disabledInfo}
                price={this.state.totalPrice}
                ordered={this.purchaseHandler} />
        </Aux>
    };
}

export default BurgerBuilder;