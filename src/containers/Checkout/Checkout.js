import React, { Component } from 'react';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';

class Checkout extends Component {
    state = {
        ingredients: {
            salad: 1,
            cheese: 2,
            meat: 1
        }
    }

    componentDidMount() {
        var query = new URLSearchParams(this.props.location.search);
        
        let ingredients = {};
        for (let params of query.entries()) {
            ingredients[params[0]] = +params[1];
        }

        this.setState({ ingredients: ingredients})
    }

    checkoutCancelHandler = () => {
        this.props.history.goBack();
    }

    checkoutContinueHandler = () => {
        this.props.history.push('/checkout/contact-data');
    }

    render() {
        return (
            <div>
                <CheckoutSummary
                    ingredients={this.state.ingredients}
                    checkoutCancelClicked={this.checkoutCancelHandler}
                    checkoutContinueClicked={this.checkoutContinueHandler} />
            </div>
        );
    }
}

export default Checkout;