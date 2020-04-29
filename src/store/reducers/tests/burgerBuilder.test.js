import reducer from '../burgerBuilder';
import * as actionTypes from '../../actions/actionTypes';

describe('burgerBuilder reducer', () => {
    let state;

    beforeEach(() => {
        state = {
            ingredients: null,
            totalPrice: 4,
            error: false,
            building: false
        }
    });

    it('should return initial state', () => {
        expect(reducer(undefined, {})).toEqual(state);
    });

    it('should store ingrediants', () => {
        expect(reducer(state, {
            type: actionTypes.SET_INGREDIENTS,
            ingredients: {
                salad: 1,
                bacon: 3,
                cheese: 2,
                meat: 3
            }
        })).toEqual({
            ...state,
            ingredients: {
                salad: 1,
                bacon: 3,
                cheese: 2,
                meat: 3
            }
        });
    });

});