import React, { Component } from 'react';

import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../components/UI/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';


const ingredientsPrice = {
    salad: 0.4,
    bacon: 0.7,
    cheese: 0.3,
    meat: 1.4
};

class BurgerBuilder extends Component {
    state = {
        ingredients: null,
        totalPrice: 0,
        purchasing: false,
        loading: false
    }

    componentDidMount() {
        axios.get('/ingredients.json')
            .then(response => {
                if (response && response.data) {
                    this.setState({ ingredients: response.data });
                }
            });
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

        // const salad = this.state.ingredients.salad;
        // const cheese = this.state.ingredients.cheese;
        // const meat = this.state.ingredients.meat;
        // const bacon = this.state.ingredients.bacon;

        // this.props.history.push(`/checkout?salad=${salad}&cheese=${cheese}&meat=${meat}&bacon=${bacon}`);

        let queryParams = [];
        for (let key in this.state.ingredients) {
            queryParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(this.state.ingredients[key])}`);
        }

        this.props.history.push({
            pathname: "/checkout",
            search: `?${queryParams.join('&')}`
        });
    };

    render() {
        const disabledInfo = { ...this.state.ingredients };
        Object.keys(disabledInfo).forEach(key => {
            disabledInfo[key] = (disabledInfo[key] === 0)
        });

        let orderSummary = null;
        let burger = <Spinner />;

        if (this.state.ingredients) {
            burger = <Aux>
                <Burger ingredients={this.state.ingredients} />
                <BuildControls
                    ingredientAdded={this.addIngredientHandler}
                    ingredientRemoved={this.removedIngredientHandler}
                    disabled={disabledInfo}
                    price={this.state.totalPrice}
                    ordered={this.purchaseHandler} />
            </Aux>;

            orderSummary = <OrderSummary
                ingredients={this.state.ingredients}
                price={this.state.totalPrice}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler}
            />;
        }

        if (this.state.loading) {
            orderSummary = <Spinner />;
        }

        return <Aux>
            <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                {orderSummary}
            </Modal>
            {burger}
        </Aux>
    };
}

export default withErrorHandler(BurgerBuilder, axios);