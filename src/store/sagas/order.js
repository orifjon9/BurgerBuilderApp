import { put } from 'redux-saga/effects';

import axios from '../../axios-orders';
import * as actions from '../actions/index';

export function* purchaseBurgerSaga(action) {
    yield put(actions.purchaseBurgerStart());
    try {
        const response = yield axios.post('/orders.json?auth=' + action.token, action.orderData);
        yield put(actions.purchaseBurgerSuccess(response.data.name, action.orderData));
        yield put(actions.resetBurgerBuilder());
    }
    catch (error) {
        yield put(actions.purchaseBurgerFail());
    }
}

export function* fetchOrdersSaga(action) {
    yield put(actions.fetchOrdersStart());
    const queryParams = `?auth=${action.token}&orderBy="userId"&equalTo="${action.userId}"`;

    try {
        const response = yield axios.get('/orders.json' + queryParams);
        let orders = [];
        for (let key in response.data) {
            orders.push({
                ...response.data[key],
                id: key
            });
        }

        // sort
        orders = yield orders.sort((a, b) => {
            return new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime();
        });
        
        // store
        yield put(actions.fetchOrdersSuccess(orders))
    }
    catch (error) {
        yield put(actions.fetchOrdersFail());
    }
}