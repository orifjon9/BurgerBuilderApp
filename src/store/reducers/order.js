import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    orders: [],
    loading: false,
    purchased: false,
    fetched: false
};
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.PURCHASE_INIT:
            return updateObject(state, { purchased: false });
        case actionTypes.PURCHASE_ORDER_SUCCESS: {
            const newOrder = {
                ...action.orderData,
                id: action.orderId
            };
            return updateObject(state, {
                loading: false,
                purchased: true,
                orders: state.orders.concat(newOrder)
            });
        }
        case actionTypes.FETCH_ORDERS_FAIL:
        case actionTypes.PURCHASE_ORDER_FAIL:
            return updateObject(state, { loading: false });
        case actionTypes.FETCH_ORDERS_START:
        case actionTypes.PURCHASE_ORDER_START:
            return updateObject(state, { loading: true });
        case actionTypes.FETCH_ORDERS_SUCCESS:
            return updateObject(state, {
                loading: false,
                fetched: true,
                orders: action.orders
            });
        default:
            return state;
    }
};


export default reducer;