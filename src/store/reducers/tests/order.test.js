import reducer from '../order';
import * as actionTypes from '../../actions/actionTypes';

describe('order reducer', () => {
    let state;

    beforeEach(() => {
        state = {
            orders: [],
            loading: false,
            purchased: false
        }
    });

    it('should return initial state', () => {
        expect(reducer(undefined, {})).toEqual(state);
    });

    it('should change prop loading to true', () => {
        expect(reducer(state, {
            type: actionTypes.PURCHASE_BURGER_START,
            loading: true
        })).toEqual({
            ...state,
            loading: true
        });
    });

});