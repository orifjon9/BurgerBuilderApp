import * as actionTypes from '../actions/actionTypes';

const initialState = {
    orders: [],
    loading: false,
    purchased: false
};
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.PURCHASE_INIT:
            return {
                ...state,
                purchased: false
            };
        case actionTypes.PURCHASE_ORDER_SUCCESS: {
            const newOrder = {
                ...action.orderData,
                id: action.orderId
            };
            return {
                ...state,
                loading: false,
                purchased: true,
                orders: state.orders.concat(newOrder)
            };
        }
        case actionTypes.PURCHASE_ORDER_FAIL:
            return {
                ...state,
                loading: false
            }
        case actionTypes.PURCHASE_ORDER_START:
            return {
                ...state,
                loading: true
            };
        default:
            return state;
    }
};


export default reducer;