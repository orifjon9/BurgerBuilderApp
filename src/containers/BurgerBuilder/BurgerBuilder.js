import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../components/UI/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';
import * as actions from '../../store/actions/index';
import Transition from 'react-transition-group/Transition';
//import CSSTransition from 'react-transition-group/CSSTransition';


export const BurgerBuilder = props => {
    const [purchasing, setPurchasing] = useState(false);

    const anomationTiming = {
        enter: 400,
        exit: 1000
    };

    useEffect(() => {
        if (!props.building) {
            props.onLoadIngredients();
        }
    }, []);

    const purchaseHandler = () => {
        if (props.isAuthenticated) {
            setPurchasing(true);
        } else {
            props.history.push('/auth');
        }
    };

    const purchaseCancelHandler = () => {
        setPurchasing(false);
    }

    const purchaseContinueHandler = () => {
        props.onPurchaseInit();
        props.history.push("/checkout");
    };

    const disabledInfo = { ...props.ings };
    Object.keys(disabledInfo).forEach(key => {
        disabledInfo[key] = (disabledInfo[key] === 0)
    });

    let orderSummary = null;
    let burger = props.error ? <p>Ingredients can't be loaded!</p> : <Spinner />;

    if (props.ings) {
        burger = <Aux>
            <Burger ingredients={props.ings} />
            <BuildControls
                ingredientAdded={props.onIngredientAdded}
                ingredientRemoved={props.onIngredientRemoved}
                disabled={disabledInfo}
                price={props.total}
                ordered={purchaseHandler}
                isAuth={props.isAuthenticated} />
        </Aux>;

        orderSummary = <OrderSummary
            ingredients={props.ings}
            price={props.total}
            purchaseCancelled={purchaseCancelHandler}
            purchaseContinued={purchaseContinueHandler}
        />;
    }

    return (<Aux>
        <Transition
            mountOnEnter
            unmountOnExit
            in={purchasing}
            timeout={anomationTiming}
            onEnter={() => console.log('onEnter')}
            onEntering={() => console.log('onEntering')}
            onEntered={() => console.log('onEntered')}
            onExit={() => console.log('onExit')}
            onExiting={() => console.log('onExiting')}
            onExited={() => console.log('onExited')}
        >
            {state => (
                <Modal show={purchasing} state={state} modalClosed={purchaseCancelHandler}>
                    {orderSummary}
                </Modal>)
            }
        </Transition>
        {burger}
    </Aux >);
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        total: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !== null,
        building: state.burgerBuilder.building
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
        onLoadIngredients: () => dispatch(actions.initIngredients()),
        onPurchaseInit: () => dispatch(actions.purchaseInit())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));