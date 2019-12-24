import * as actionTypes from './actions';

const initialState = {
    ingredients: {
        salad: 0,
        bacon: 0,
        cheese: 0,
        meat: 0
    },
    totalPrice: 0,
};

const ingredientsPrice = {
    salad: 0.4,
    bacon: 0.7,
    cheese: 0.3,
    meat: 1.4
};

const reducer = (state = initialState, action) => {
    switch(action.type)
    {
        case actionTypes.ADD_INGREDIENTS: 
            return {
                ...state,
                ingredients: {
                    ...state.ingredients,
                    [action.ingredientName]: state.ingredients[action.ingredientName] + 1
                },
                totalPrice: state.totalPrice + ingredientsPrice[action.ingredientName]
            };
        case actionTypes.REMOVE_INGREDIENTS: 
        return {
            ...state,
            ingredients: {
                ...state.ingredients,
                [action.ingredientName]: state.ingredients[action.ingredientName] - 1
            },
            totalPrice: state.totalPrice - ingredientsPrice[action.ingredientName]
        };
        default: return state;
    }
}

export default reducer;