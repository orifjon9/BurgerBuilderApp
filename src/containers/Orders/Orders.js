import React, { Component } from 'react';
import { connect } from 'react-redux';

import Order from '../../components/Order/Order';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../components/UI/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';
import { Redirect } from 'react-router-dom';

class Orders extends Component {

    componentDidMount() {
        if (this.props.token !== null && !this.props.fetchedOrders) {
            this.props.onFetchOrders(this.props.token, this.props.userId);
        }
    }

    render() {
        let orders = <Spinner />;
        if (this.props.token === null) {
            orders = <Redirect to="/" />;
        } else if (this.props.orders && !this.props.loading) {
            orders = this.props.orders.map(x => {
                return <Order key={x.id} order={x} />
            });
        }

        return (
            <div>
                {orders}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        orders: state.order.orders,
        loading: state.order.loading,
        fetchedOrders: state.order.fetched,
        token: state.auth.token,
        userId: state.auth.userId
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onFetchOrders: (token, userId) => dispatch(actions.fetchOrdersAsync(token, userId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders, axios));