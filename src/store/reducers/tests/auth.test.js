import reducer from '../auth';
import * as actionTypes from '../../actions/actionTypes';

describe('auth reducer', () => {
    let state;

    beforeEach(() => {
        state = {
            idToken: null,
            userID: null,
            error: null,
            loading: false,
            authRedirectPath: '/'
        };
    });

    it('should return the initial state', () => {
        expect(reducer(undefined, {})).toEqual(state);
    });

    it('should store the token upon login', () => {
        expect(reducer(state, {
            type: actionTypes.AUTH_SUCCESS,
            idToken: 'some-token',
            userID: 'some-userID'
        })).toEqual({
            ...state,
            idToken: 'some-token',
            userID: 'some-userID'
        });
    })
});