import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

export const purchaseBurgerSuccess = (id, orderData) => {
    return {
        type: actionTypes.PURCHASE_ORDER_SUCCESS,
        orderId: id,
        orderData: orderData
    };
};

export const purchaseBurgerFail = (error) => {
    return {
        type: actionTypes.PURCHASE_ORDER_FAIL,
        error: error
    }
};

export const purchaseBurgerStart = () => {
    return {
        type: actionTypes.PURCHASE_ORDER_START
    };
};

export const purchaseInit = () => {
    return {
        type: actionTypes.PURCHASE_INIT
    };
};

export const purchaseBurgerAsync = (orderData, token) => {
    return dispatch => {
        dispatch(purchaseBurgerStart());
        axios.post('/orders.json?auth=' + token, orderData)
            .then(response => {
                dispatch(purchaseBurgerSuccess(response.data.name, orderData));
            })
            .catch(error => {
                dispatch(purchaseBurgerFail());
            });
    };
};

export const fetchOrdersStart = () => {
    return {
        type: actionTypes.FETCH_ORDERS_START
    };
};

export const fetchOrdersSuccess = (orders) => {
    return {
        type: actionTypes.FETCH_ORDERS_SUCCESS,
        orders: orders
    };
};

export const fetchOrdersFail = () => {
    return {
        type: actionTypes.PURCHASE_ORDER_FAIL
    };
};

export const fetchOrdersAsync = (token) => {
    return dispatch => {
        dispatch(fetchOrdersStart());
        axios.get('/orders.json?auth=' + token)
            .then(res => {
                let orders = [];
                for (let key in res.data) {
                    orders.push({
                        ...res.data[key],
                        id: key
                    });
                }
                // sort
                orders = orders.sort((a, b) => {
                    return new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime();
                });
                // store
                dispatch(fetchOrdersSuccess(orders))
            }).catch(err => {
                dispatch(fetchOrdersFail())
            });
    };
};