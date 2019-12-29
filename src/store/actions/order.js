import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';
import { resetBurgerBuilder } from './burgerBuilder';

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
                dispatch(resetBurgerBuilder());
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

export const resetFetchedOrders = () => {
    return {
        type: actionTypes.RESET_FETCHED_ORDERS
    };
};

export const fetchOrdersAsync = (token, userId) => {
    return dispatch => {
        dispatch(fetchOrdersStart());
        const queryParams = `?auth=${token}&orderBy="userId"&equalTo="${userId}"`;
        axios.get('/orders.json' + queryParams)
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