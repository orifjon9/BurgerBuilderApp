import { put, delay, call } from 'redux-saga/effects';
import axios from 'axios';

import * as actionTypes from '../actions/actionTypes';
import * as actions from '../actions/index';

export function* logoutSaga(action) {
    yield call([localStorage, 'removeItem'], 'auth');
    yield put({
        type: actionTypes.AUTH_LOGOUT
    });
};

export function* authCheckExpirationTimeSaga(action) {
    yield delay(action.expirationTime * 1000);
    yield put(actions.logOut());
}

export function* singUpSaga(action) {
    yield put(actions.authStart());
    const authBody = {
        email: action.email,
        password: action.password,
        returnSecureToken: true
    }
    try {
        const response = yield axios.post('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDgP2G7P6qYh2FT14ZnPvMQMojsVgMu_TU', authBody);
        yield put(actions.authRestoreResponse(response));
    } catch (error) {
        yield put(actions.authFail(error.response.data.error.message));
    };
}

export function* singInSaga(action) {
    yield put(actions.authStart());
    const authBody = {
        email: action.email,
        password: action.password,
        returnSecureToken: true
    }
    try {
        const response = yield axios.post('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDgP2G7P6qYh2FT14ZnPvMQMojsVgMu_TU', authBody);
        yield put(actions.authRestoreResponse(response));
    } catch (error) {
        yield put(actions.authFail(error.response.data.error.message));
    };
}

export function* persistAuthResposeSaga(action) {
    let currectDate = yield new Date();
    yield currectDate.setUTCSeconds(action.expiresIn);

    const authData = {
        email: action.email,
        token: action.idToken,
        userId: action.localId,
        expiresIn: currectDate
    }
    yield put(actions.authSuccess(authData.email, authData.token, authData.userId));
    yield put(actions.resetFetchedOrders());
    yield put(actions.checkExpirationTime(action.expiresIn));
    yield localStorage.setItem("auth", JSON.stringify(authData));
};

export function* authCheckStatusSaga(action) {
    const storedAuthData = yield localStorage.getItem("auth");
    if (storedAuthData) {
        const authData = yield JSON.parse(storedAuthData);
        const expireDate = yield new Date(authData.expiresIn);
        if (expireDate > (yield new Date())) {
            yield put(actions.authSuccess(authData.email, authData.token, authData.userId));
            yield put(actions.checkExpirationTime((expireDate - (yield new Date())) / 1000));
        } else {
            yield put(actions.logOut());
        }
    }
}