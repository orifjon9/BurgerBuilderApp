import { put } from 'redux-saga/effects';

import * as actionTypes from '../actions/actionTypes';

export function* logoutSaga (action) {
    yield localStorage.removeItem("auth");
    yield put({
        type: actionTypes.AUTH_LOGOUT
    });
};