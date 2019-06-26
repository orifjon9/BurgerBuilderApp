import React, { Component } from 'react';

import Aux from '../../hoc/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';

class BurgerBuilder extends Component {
    state = {
        ingredients: {
            salad: 1,
            bacon: 1,
            cheese: 2,
            meat: 2
        }
    }

    addIngredientHandler = (type) => {
        const updatedIngredients = { ...this.state.ingredients };
        const updatedIngredientCount = updatedIngredients[type] + 1;
        updatedIngredients[type] = updatedIngredientCount;

        this.setState({ ingredients: updatedIngredients });
    }

    removedIngredientHandler = (type) => {
        const updatedIngredients = { ...this.state.ingredients };
        const oldIngredientCount = updatedIngredients[type];

        if (oldIngredientCount > 0) {
            updatedIngredients[type] = oldIngredientCount - 1;
            this.setState({ ingredients: updatedIngredients });
        }
    }

    render() {
        const disabledInfo = { ...this.state.ingredients };
        Object.keys(disabledInfo).forEach(key => {
            disabledInfo[key] = (disabledInfo[key] === 0)
        });

        return <Aux>
            <Burger ingredients={this.state.ingredients} />
            <BuildControls
                ingredientAdded={this.addIngredientHandler}
                ingredientRemoved={this.removedIngredientHandler}
                disabled={disabledInfo} />
        </Aux>
    };
}

export default BurgerBuilder;