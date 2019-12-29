import * as actionTypes from './actionTypes';
import axios from 'axios';
import { resetFetchedOrders } from './order';

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
    localStorage.removeItem("auth");
    return {
        type: actionTypes.AUTH_LOGOUT
    };
};

const checkExpirationTime = expirationTime => {
    return dispatch => {
        setTimeout(() => dispatch(logOut()), expirationTime * 1000);
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
                persistAuthRespose(response, dispatch);
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
                persistAuthRespose(response, dispatch);
            })
            .catch(error => {
                dispatch(authFail(error.response.data.error.message));
            });
    };
};

const persistAuthRespose = (response, dispatch) => {
    let currectDate = new Date();
    currectDate.setUTCSeconds(response.data.expiresIn);

    const authData = {
        email: response.data.email,
        token: response.data.idToken,
        userId: response.data.localId,
        expiresIn: currectDate
    }
    dispatch(authSuccess(authData.email, authData.token, authData.userId));
    dispatch(resetFetchedOrders());
    dispatch(checkExpirationTime(response.data.expiresIn));
    setAuthDataToStore(authData);
};

export const checkAuthStatusAsync = () => {
    return dispatch => {
        const storedAuthData = localStorage.getItem("auth");
        if (storedAuthData) {
            const authData = JSON.parse(storedAuthData);
            const expireDate = new Date(authData.expiresIn);
            if (expireDate > (new Date())) {
                dispatch(authSuccess(authData.email, authData.token, authData.userId));
                dispatch(checkExpirationTime((expireDate - (new Date())) / 1000));
            } else {
                dispatch(logOut());
            }
        }
    }
};

const setAuthDataToStore = authData => {
    localStorage.setItem("auth", JSON.stringify(authData));
};
