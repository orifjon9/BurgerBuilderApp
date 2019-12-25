import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../components/UI/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';
import * as buildBurgerActions from '../../store/actions/index';

class BurgerBuilder extends Component {
    state = {
        purchasing: false
    }

    componentDidMount() {
        this.props.onLoadIngredients();
    }

    purchaseHandler = () => {
        this.setState({ purchasing: true });
    };

    purchaseCancelHandler = () => {
        this.setState({ purchasing: false });
    };

    purchaseContinueHandler = () => {
        this.props.history.push("/checkout");
    };

    render() {
        const disabledInfo = { ...this.props.ings };
        Object.keys(disabledInfo).forEach(key => {
            disabledInfo[key] = (disabledInfo[key] === 0)
        });

        let orderSummary = null;
        let burger = this.props.error? <p>Ingredients can't be loaded!</p> : <Spinner />;

        if (this.props.ings) {
            burger = <Aux>
                <Burger ingredients={this.props.ings} />
                <BuildControls
                    ingredientAdded={this.props.onIngredientAdded}
                    ingredientRemoved={this.props.onIngredientRemoved}
                    disabled={disabledInfo}
                    price={this.props.total}
                    ordered={this.purchaseHandler} />
            </Aux>;

            orderSummary = <OrderSummary
                ingredients={this.props.ings}
                price={this.props.total}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler}
            />;
        }

        return <Aux>
            <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                {orderSummary}
            </Modal>
            {burger}
        </Aux>
    };
}

const mapStateToProps = state => {
    return {
        ings: state.ingredients,
        total: state.totalPrice,
        error: state.error
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(buildBurgerActions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(buildBurgerActions.removeIngredient(ingName)),
        onLoadIngredients: () => dispatch(buildBurgerActions.initIngredientsAsync())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));