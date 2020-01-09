import { takeEvery, all } from 'redux-saga/effects';

import { logoutSaga, authCheckExpirationTimeSaga, persistAuthResposeSaga, singUpSaga, singInSaga, authCheckStatusSaga } from './auth';
import { initIngredientsSaga } from './burgerBuilder';
import { purchaseBurgerSaga, fetchOrdersSaga } from './order';
import * as actionTypes from '../actions/actionTypes';

// Redux Saga: Full Documentation => https://redux-saga.js.org/
// Advanced Concepts: https://redux-saga.js.org/docs/advanced/
// API Reference: https://redux-saga.js.org/docs/api/
// Pros & Cons for Redux Saga vs Thunks: https://stackoverflow.com/questions/34930735/pros-cons-of-using-redux-saga-with-es6-generators-vs-redux-thunk-with-es2017-asy/34933395

export function* watchAuth() {
    yield all([
        takeEvery(actionTypes.AUTH_INIT_LOGOUT, logoutSaga),
        takeEvery(actionTypes.AUTH_CHECK_EXPIRATION_TIME, authCheckExpirationTimeSaga),
        takeEvery(actionTypes.AUTH_RESTORE_RESPONSE, persistAuthResposeSaga),
        takeEvery(actionTypes.AUTH_SIGN_UP, singUpSaga),
        takeEvery(actionTypes.AUTH_SIGN_IN, singInSaga),
        takeEvery(actionTypes.AUTH_CHECK_TOKEN, authCheckStatusSaga)
    ]);
}

export function* watchBurgerBuilder() {
    yield takeEvery(actionTypes.INIT_INGREDIENTS, initIngredientsSaga);
}

export function* watchOrder() {
    yield takeEvery(actionTypes.PURCHASE_BURGER, purchaseBurgerSaga);
    yield takeEvery(actionTypes.FETCH_ORDERS, fetchOrdersSaga);
}