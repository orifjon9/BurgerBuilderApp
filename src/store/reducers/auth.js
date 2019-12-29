import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
    email: null,
    token: null,
    userId: null,
    error: null,
    loading: false
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.AUTH_START:
            return updateObject(state, { loading: true, error: null });
        case actionTypes.AUTH_SUCCESS:
            return updateObject(state, {
                email: action.email,
                token: action.token,
                userId: action.userId,
                loading: false,
                error: null
            });
        case actionTypes.AUTH_FAIL:
            return updateObject(state, { loading: false, error: action.error });
        case actionTypes.AUTH_LOGOUT:
            return updateObject(state, { email: null, token: null, userId: null });
        default:
            return state;
    }
};

export default reducer;