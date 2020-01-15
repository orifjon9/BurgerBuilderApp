import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from '../../components/Order/ContactData/ContactData';

const Checkout = props => {

    const checkoutCancelHandler = () => {
        props.history.goBack();
    }

    const checkoutContinueHandler = () => {
        props.history.push('/checkout/contact-data');
    }
    let summary = <Redirect to="/" />
    if (props.ings) {
        const purchasedRedirect = props.purchased ? <Redirect to="/orders" /> : null;
        summary = (
            <div>
                {purchasedRedirect}
                <CheckoutSummary
                    ingredients={props.ings}
                    checkoutCancelClicked={checkoutCancelHandler}
                    checkoutContinueClicked={checkoutContinueHandler} />

                <Route path={props.match.url + '/contact-data'} component={ContactData} />
            </div>
        );
    }

    return summary;
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        purchased: state.order.purchased
    }
};


export default connect(mapStateToProps)(Checkout);