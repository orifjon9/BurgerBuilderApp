import * as actionTypes from './actionTypes';

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
        type: actionTypes.AUTH_INIT_LOGOUT
    };
};

export const checkExpirationTime = expirationTime => {
    return {
        type: actionTypes.AUTH_CHECK_EXPIRATION_TIME,
        expirationTime: expirationTime
    }
}

export const singUpAsync = (email, password) => {
    return {
        type: actionTypes.AUTH_SIGN_UP,
        email: email,
        password: password
    }
};

export const singInAsync = (email, password) => {
    return {
        type: actionTypes.AUTH_SIGN_IN,
        email: email,
        password: password
    };
};

export const authRestoreResponse = (response) => {
    return {
        type: actionTypes.AUTH_RESTORE_RESPONSE,
        email: response.data.email,
        idToken: response.data.idToken,
        localId: response.data.localId,
        expiresIn: response.data.expiresIn
    };
}

export const checkAuthStatusAsync = () => {
    return {
        type: actionTypes.AUTH_CHECK_TOKEN
    };
};
