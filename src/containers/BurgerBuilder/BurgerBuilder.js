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
import * as actions from '../../store/actions/index';
import Transition from 'react-transition-group/Transition';
import CSSTransition from 'react-transition-group/CSSTransition';


export class BurgerBuilder extends Component {
    state = {
        purchasing: false
    }

    anomationTiming = {
        enter: 400,
        exit: 1000
    };

    componentDidMount() {
        if (!this.props.building) {
            this.props.onLoadIngredients();
        }
    }

    purchaseHandler = () => {
        if (this.props.isAuthenticated) {
            this.setState({ purchasing: true });
        } else {
            this.props.history.push('/auth');
        }
    };

    purchaseCancelHandler = () => {
        this.setState({ purchasing: false });
    }

    purchaseContinueHandler = () => {
        this.props.onPurchaseInit();
        this.props.history.push("/checkout");
    };

    render() {
        const disabledInfo = { ...this.props.ings };
        Object.keys(disabledInfo).forEach(key => {
            disabledInfo[key] = (disabledInfo[key] === 0)
        });

        let orderSummary = null;
        let burger = this.props.error ? <p>Ingredients can't be loaded!</p> : <Spinner />;

        if (this.props.ings) {
            burger = <Aux>
                <Burger ingredients={this.props.ings} />
                <BuildControls
                    ingredientAdded={this.props.onIngredientAdded}
                    ingredientRemoved={this.props.onIngredientRemoved}
                    disabled={disabledInfo}
                    price={this.props.total}
                    ordered={this.purchaseHandler}
                    isAuth={this.props.isAuthenticated} />
            </Aux>;

            orderSummary = <OrderSummary
                ingredients={this.props.ings}
                price={this.props.total}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler}
            />;
        }

        console.log(this.state.purchasing);
        return <Aux>
            <Transition 
                mountOnEnter
                unmountOnExit
                in={this.state.purchasing} 
                timeout={this.anomationTiming}
                onEnter={()=>console.log('onEnter')}                
                onEntering={()=>console.log('onEntering')}                
                onEntered={()=>console.log('onEntered')}                
                onExit={()=>console.log('onExit')}                
                onExiting={()=>console.log('onExiting')}                
                onExited={()=>console.log('onExited')}                
                >
                { state => (
                    <Modal show={this.state.purchasing} state={state} modalClosed={this.purchaseCancelHandler}>
                        {orderSummary}
                    </Modal>)
                }
            </Transition>
            {burger}
        </Aux >
    };
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