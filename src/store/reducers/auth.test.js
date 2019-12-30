import reducer from './auth';
import * as actionTypes from '../actions/actionTypes';

describe('Auth Store/Reducer', () => {

    it('should be default store if unknown action was executed', () => {
        expect(reducer(undefined, {})).toEqual({
            email: null,
            token: null,
            userId: null,
            error: null,
            loading: false
        });
    });

    it('should be stored auth data after authenticated', () => {
        expect(reducer(undefined, {
            type: actionTypes.AUTH_SUCCESS,
            email: 'some-email',
            token: 'some-token',
            userId: 'some-user-id' 
        })).toEqual({
            email: 'some-email',
            token: 'some-token',
            userId: 'some-user-id' ,
            error: null,
            loading: false
        });
    });
});

