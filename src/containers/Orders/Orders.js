import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import Order from '../../components/Order/Order';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../components/UI/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';
import { Redirect } from 'react-router-dom';

const Orders = props => {
    const { token, userId, fetchedOrders, onFetchOrders } = props;
    useEffect(() => {
        if (token !== null && !fetchedOrders) {
            onFetchOrders(token, userId);
        }
    }, [token, userId, fetchedOrders, onFetchOrders]);

    let orders = <Spinner />;
    if (props.token === null) {
        orders = <Redirect to="/" />;
    } else if (props.orders && !props.loading) {
        orders = props.orders.map(x => {
            return <Order key={x.id} order={x} />
        });
    }

    return (
        <div>
            {orders}
        </div>
    );
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
        onFetchOrders: (token, userId) => dispatch(actions.fetchOrders(token, userId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders, axios));