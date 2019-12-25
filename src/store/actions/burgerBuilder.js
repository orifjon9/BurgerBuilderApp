import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';


export const addIngredient = (ingName) => {
    return {
        type: actionTypes.ADD_INGREDIENT,
        ingredientName: ingName
    };
};

export const removeIngredient = (ingName) => {
    return {
        type: actionTypes.REMOVE_INGREDIENT,
        ingredientName: ingName
    };
};

const setIngredients = ingredients => {
    return {
        type: actionTypes.SET_INGREDIENTS,
        ingredients: ingredients
    };
};

const fetchIngredientsFailed = () => {
    return {
        type: actionTypes.FETCH_INGREDIENTS_FAILED
    };
};

export const initIngredientsAsync = () => {
    return dispatch => {
        axios.get('/ingredients.json')
            .then(response => {
                if (response && response.data) {
                    dispatch(setIngredients(response.data));
                }
            })
            .catch(err => {
                dispatch(fetchIngredientsFailed());
            });
    }
};