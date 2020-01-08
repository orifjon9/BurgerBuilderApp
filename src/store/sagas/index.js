import { takeEvery } from 'redux-saga/effects';

import { logoutSaga, authCheckExpirationTimeSaga, persistAuthResposeSaga, singUpSaga, singInSaga, authCheckStatusSaga } from './auth';
import { initIngredientsSaga } from './burgerBuilder';
import * as actionTypes from '../actions/actionTypes';

export function* watchAuth() {
    yield takeEvery(actionTypes.AUTH_INIT_LOGOUT, logoutSaga);
    yield takeEvery(actionTypes.AUTH_CHECK_EXPIRATION_TIME, authCheckExpirationTimeSaga);
    yield takeEvery(actionTypes.AUTH_RESTORE_RESPONSE, persistAuthResposeSaga);
    yield takeEvery(actionTypes.AUTH_SIGN_UP, singUpSaga);
    yield takeEvery(actionTypes.AUTH_SIGN_IN, singInSaga);
    yield takeEvery(actionTypes.AUTH_CHECK_TOKEN, authCheckStatusSaga);
}

export function* watchBurgerBuilder() {
    yield takeEvery(actionTypes.INIT_INGREDIENTS, initIngredientsSaga);
}