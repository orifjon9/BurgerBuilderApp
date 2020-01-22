import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

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

    const dispatch = useDispatch();

    const onIngredientAdded = (ingName) => dispatch(actions.addIngredient(ingName));
    const onIngredientRemoved = (ingName) => dispatch(actions.removeIngredient(ingName));
    const onLoadIngredients = useCallback(() => dispatch(actions.initIngredients()), [dispatch]);
    const onPurchaseInit = () => dispatch(actions.purchaseInit());

    const ings = useSelector(state => state.burgerBuilder.ingredients);
    const total = useSelector(state => state.burgerBuilder.totalPrice);
    const error = useSelector(state => state.burgerBuilder.error);
    const isAuthenticated = useSelector(state => state.auth.token !== null);
    const building = useSelector(state => state.burgerBuilder.building);

    useEffect(() => {
        if (!building) {
            onLoadIngredients();
        }
    }, [building, onLoadIngredients]);

    const purchaseHandler = () => {
        if (isAuthenticated) {
            setPurchasing(true);
        } else {
            props.history.push('/auth');
        }
    };

    const purchaseCancelHandler = () => {
        setPurchasing(false);
    }

    const purchaseContinueHandler = () => {
        onPurchaseInit();
        props.history.push("/checkout");
    };

    const disabledInfo = { ...ings };
    Object.keys(disabledInfo).forEach(key => {
        disabledInfo[key] = (disabledInfo[key] === 0)
    });

    let orderSummary = null;
    let burger = error ? <p>Ingredients can't be loaded!</p> : <Spinner />;

    if (ings) {
        burger = <Aux>
            <Burger ingredients={ings} />
            <BuildControls
                ingredientAdded={onIngredientAdded}
                ingredientRemoved={onIngredientRemoved}
                disabled={disabledInfo}
                price={total}
                ordered={purchaseHandler}
                isAuth={isAuthenticated} />
        </Aux>;

        orderSummary = <OrderSummary
            ingredients={ings}
            price={total}
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

export default withErrorHandler(BurgerBuilder, axios);