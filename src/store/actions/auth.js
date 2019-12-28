import * as actionTypes from './actionTypes';
import axios from 'axios';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const authSuccess = (email, token, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        email: email,
        token: token,
        userId: userId
    };
};

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    };
};

export const logOut = () => {
    return {
        type: actionTypes.AUTH_LOGOUT
    };
};

const checkExpirationTime = expirationTime => {
    return dispatch => {
        setTimeout(() => logOut(), expirationTime * 1000);
    }
}

export const singUpAsync = (email, password) => {
    return dispatch => {
        dispatch(authStart());
        const authBody = {
            email: email,
            password: password,
            returnSecureToken: true
        }
        axios.post('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDgP2G7P6qYh2FT14ZnPvMQMojsVgMu_TU', authBody)
            .then(response => {
                console.log(response.data);
                dispatch(authSuccess(response.data.email, response.data.idToken, response.data.localId));

            })
            .catch(error => {
                dispatch(authFail(error.response.data.error.message));
            });
    };
};

export const singInAsync = (email, password) => {
    return dispatch => {
        dispatch(authStart());
        const authBody = {
            email: email,
            password: password,
            returnSecureToken: true
        }
        axios.post('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDgP2G7P6qYh2FT14ZnPvMQMojsVgMu_TU', authBody)
            .then(response => {
                console.log(response.data);
                dispatch(authSuccess(response.data.email, response.data.idToken, response.data.localId));
                dispatch(checkExpirationTime(response.data.expiresIn));
            })
            .catch(error => {
                dispatch(authFail(error.response.data.error.message));
            });
    };
};
