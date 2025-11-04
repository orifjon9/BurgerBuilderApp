# State Management Documentation

## Table of Contents

1. [Overview](#overview)
2. [Redux Store Setup](#redux-store-setup)
3. [State Structure](#state-structure)
4. [Actions](#actions)
5. [Reducers](#reducers)
6. [Redux-Saga](#redux-saga)
7. [Connecting Components](#connecting-components)
8. [Best Practices](#best-practices)

## Overview

BurgerBuilderApp uses **Redux** for state management with **Redux-Saga** as the primary middleware for handling asynchronous operations and side effects.

### Why Redux-Saga?

- **Generator Functions**: More readable async code than thunks
- **Centralized Side Effects**: All async logic in one place
- **Testability**: Easy to test generator functions
- **Cancellation**: Built-in task cancellation
- **Advanced Patterns**: Race conditions, parallel execution, etc.

## Redux Store Setup

**Location**: `/src/index.js`

```javascript
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import thunk from 'redux-thunk';

import burgerBuilderReducer from './store/reducers/burgerBuilder';
import orderReducer from './store/reducers/order';
import authReducer from './store/reducers/auth';
import { watchAuth, watchBurgerBuilder, watchOrder } from './store/sagas';

// Combine reducers
const rootReducer = combineReducers({
  burgerBuilder: burgerBuilderReducer,
  order: orderReducer,
  auth: authReducer
});

// Create saga middleware
const sagaMiddleware = createSagaMiddleware();

// Middleware array
const middleware = [sagaMiddleware];

// Add logger in development
if (process.env.NODE_ENV === 'development') {
  middleware.push(logger);
}

// Redux DevTools setup
const composeEnhancers =
  process.env.NODE_ENV === 'development'
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    : compose;

// Create store
const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(...middleware))
);

// Run sagas
sagaMiddleware.run(watchAuth);
sagaMiddleware.run(watchBurgerBuilder);
sagaMiddleware.run(watchOrder);
```

## State Structure

### Complete State Shape

```javascript
{
  // Burger Builder Module
  burgerBuilder: {
    ingredients: {
      salad: number,   // Quantity of salad
      bacon: number,   // Quantity of bacon
      cheese: number,  // Quantity of cheese
      meat: number     // Quantity of meat
    },
    totalPrice: number,    // Current burger price
    error: boolean,        // Ingredient loading error
    building: boolean      // User has modified burger
  },

  // Order Module
  order: {
    orders: [
      {
        id: string,
        ingredients: {
          salad: number,
          bacon: number,
          cheese: number,
          meat: number
        },
        price: number,
        orderData: {
          name: string,
          street: string,
          zipCode: string,
          country: string,
          email: string,
          deliveryMethod: string
        },
        userId: string
      }
    ],
    loading: boolean,      // Order submission/fetch loading
    purchased: boolean,    // Order successfully placed
    fetched: boolean       // Orders have been fetched
  },

  // Authentication Module
  auth: {
    token: string | null,           // JWT token
    userId: string | null,          // User ID from Firebase
    email: string | null,           // User email
    error: string | null,           // Auth error message
    loading: boolean,               // Auth operation in progress
    authRedirectPath: string        // Path to redirect after auth
  }
}
```

### Initial State

Each reducer defines its own initial state:

```javascript
// burgerBuilder initial state
const initialState = {
  ingredients: null,
  totalPrice: 4,
  error: false,
  building: false
};

// order initial state
const initialState = {
  orders: [],
  loading: false,
  purchased: false,
  fetched: false
};

// auth initial state
const initialState = {
  token: null,
  userId: null,
  error: null,
  loading: false,
  authRedirectPath: '/'
};
```

## Actions

### Action Types

**Location**: `/src/store/actions/actionTypes.js`

```javascript
// Burger Builder Actions
export const ADD_INGREDIENT = 'ADD_INGREDIENT';
export const REMOVE_INGREDIENT = 'REMOVE_INGREDIENT';
export const SET_INGREDIENTS = 'SET_INGREDIENTS';
export const FETCH_INGREDIENTS_FAILED = 'FETCH_INGREDIENTS_FAILED';
export const INIT_INGREDIENTS = 'INIT_INGREDIENTS';

// Order Actions
export const PURCHASE_BURGER = 'PURCHASE_BURGER';
export const PURCHASE_BURGER_START = 'PURCHASE_BURGER_START';
export const PURCHASE_BURGER_SUCCESS = 'PURCHASE_BURGER_SUCCESS';
export const PURCHASE_BURGER_FAIL = 'PURCHASE_BURGER_FAIL';
export const PURCHASE_INIT = 'PURCHASE_INIT';
export const FETCH_ORDERS = 'FETCH_ORDERS';
export const FETCH_ORDERS_START = 'FETCH_ORDERS_START';
export const FETCH_ORDERS_SUCCESS = 'FETCH_ORDERS_SUCCESS';
export const FETCH_ORDERS_FAIL = 'FETCH_ORDERS_FAIL';

// Auth Actions
export const AUTH_START = 'AUTH_START';
export const AUTH_SUCCESS = 'AUTH_SUCCESS';
export const AUTH_FAIL = 'AUTH_FAIL';
export const AUTH_LOGOUT = 'AUTH_LOGOUT';
export const AUTH_USER = 'AUTH_USER';
export const SET_AUTH_REDIRECT_PATH = 'SET_AUTH_REDIRECT_PATH';
export const AUTH_CHECK_STATE = 'AUTH_CHECK_STATE';
export const AUTH_CHECK_TIMEOUT = 'AUTH_CHECK_TIMEOUT';
export const AUTH_INITIATE_LOGOUT = 'AUTH_INITIATE_LOGOUT';
```

### Action Creators

#### Burger Builder Actions

**Location**: `/src/store/actions/burgerBuilder.js`

```javascript
// Synchronous actions (handled by reducer)
export const addIngredient = (name) => ({
  type: actionTypes.ADD_INGREDIENT,
  ingredientName: name
});

export const removeIngredient = (name) => ({
  type: actionTypes.REMOVE_INGREDIENT,
  ingredientName: name
});

export const setIngredients = (ingredients) => ({
  type: actionTypes.SET_INGREDIENTS,
  ingredients: ingredients
});

export const fetchIngredientsFailed = () => ({
  type: actionTypes.FETCH_INGREDIENTS_FAILED
});

// Saga action (triggers saga)
export const initIngredients = () => ({
  type: actionTypes.INIT_INGREDIENTS
});
```

#### Order Actions

**Location**: `/src/store/actions/order.js`

```javascript
// Saga actions
export const purchaseBurger = (orderData, token) => ({
  type: actionTypes.PURCHASE_BURGER,
  orderData: orderData,
  token: token
});

export const fetchOrders = (token, userId) => ({
  type: actionTypes.FETCH_ORDERS,
  token: token,
  userId: userId
});

// Reducer actions
export const purchaseBurgerStart = () => ({
  type: actionTypes.PURCHASE_BURGER_START
});

export const purchaseBurgerSuccess = (id, orderData) => ({
  type: actionTypes.PURCHASE_BURGER_SUCCESS,
  orderId: id,
  orderData: orderData
});

export const purchaseBurgerFail = (error) => ({
  type: actionTypes.PURCHASE_BURGER_FAIL,
  error: error
});

export const purchaseInit = () => ({
  type: actionTypes.PURCHASE_INIT
});
```

#### Auth Actions

**Location**: `/src/store/actions/auth.js`

```javascript
// Saga actions
export const auth = (email, password, isSignup) => ({
  type: actionTypes.AUTH_USER,
  email: email,
  password: password,
  isSignup: isSignup
});

export const logout = () => ({
  type: actionTypes.AUTH_INITIATE_LOGOUT
});

export const checkAuthTimeout = (expirationTime) => ({
  type: actionTypes.AUTH_CHECK_TIMEOUT,
  expirationTime: expirationTime
});

export const authCheckState = () => ({
  type: actionTypes.AUTH_CHECK_STATE
});

// Reducer actions
export const authStart = () => ({
  type: actionTypes.AUTH_START
});

export const authSuccess = (token, userId) => ({
  type: actionTypes.AUTH_SUCCESS,
  idToken: token,
  userId: userId
});

export const authFail = (error) => ({
  type: actionTypes.AUTH_FAIL,
  error: error
});

export const logoutSucceed = () => ({
  type: actionTypes.AUTH_LOGOUT
});
```

## Reducers

Reducers are **pure functions** that take the current state and an action, and return a new state.

### Burger Builder Reducer

**Location**: `/src/store/reducers/burgerBuilder.js`

```javascript
import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const INGREDIENT_PRICES = {
  salad: 0.4,
  cheese: 0.3,
  meat: 1.4,
  bacon: 0.7
};

const initialState = {
  ingredients: null,
  totalPrice: 4,
  error: false,
  building: false
};

const addIngredient = (state, action) => {
  const updatedIngredient = {
    [action.ingredientName]: state.ingredients[action.ingredientName] + 1
  };
  const updatedIngredients = updateObject(state.ingredients, updatedIngredient);
  const updatedState = {
    ingredients: updatedIngredients,
    totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName],
    building: true
  };
  return updateObject(state, updatedState);
};

const removeIngredient = (state, action) => {
  const updatedIng = {
    [action.ingredientName]: state.ingredients[action.ingredientName] - 1
  };
  const updatedIngs = updateObject(state.ingredients, updatedIng);
  const updatedSt = {
    ingredients: updatedIngs,
    totalPrice: state.totalPrice - INGREDIENT_PRICES[action.ingredientName],
    building: true
  };
  return updateObject(state, updatedSt);
};

const setIngredients = (state, action) => {
  return updateObject(state, {
    ingredients: {
      salad: action.ingredients.salad,
      bacon: action.ingredients.bacon,
      cheese: action.ingredients.cheese,
      meat: action.ingredients.meat
    },
    totalPrice: 4,
    error: false,
    building: false
  });
};

const fetchIngredientsFailed = (state, action) => {
  return updateObject(state, { error: true });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_INGREDIENT: return addIngredient(state, action);
    case actionTypes.REMOVE_INGREDIENT: return removeIngredient(state, action);
    case actionTypes.SET_INGREDIENTS: return setIngredients(state, action);
    case actionTypes.FETCH_INGREDIENTS_FAILED: return fetchIngredientsFailed(state, action);
    default: return state;
  }
};

export default reducer;
```

### Order Reducer

**Location**: `/src/store/reducers/order.js`

```javascript
import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
  orders: [],
  loading: false,
  purchased: false,
  fetched: false
};

const purchaseInit = (state, action) => {
  return updateObject(state, { purchased: false });
};

const purchaseBurgerStart = (state, action) => {
  return updateObject(state, { loading: true });
};

const purchaseBurgerSuccess = (state, action) => {
  const newOrder = updateObject(action.orderData, { id: action.orderId });
  return updateObject(state, {
    loading: false,
    purchased: true,
    orders: state.orders.concat(newOrder)
  });
};

const purchaseBurgerFail = (state, action) => {
  return updateObject(state, { loading: false });
};

const fetchOrdersStart = (state, action) => {
  return updateObject(state, { loading: true });
};

const fetchOrdersSuccess = (state, action) => {
  return updateObject(state, {
    orders: action.orders,
    loading: false,
    fetched: true
  });
};

const fetchOrdersFail = (state, action) => {
  return updateObject(state, { loading: false });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.PURCHASE_INIT: return purchaseInit(state, action);
    case actionTypes.PURCHASE_BURGER_START: return purchaseBurgerStart(state, action);
    case actionTypes.PURCHASE_BURGER_SUCCESS: return purchaseBurgerSuccess(state, action);
    case actionTypes.PURCHASE_BURGER_FAIL: return purchaseBurgerFail(state, action);
    case actionTypes.FETCH_ORDERS_START: return fetchOrdersStart(state, action);
    case actionTypes.FETCH_ORDERS_SUCCESS: return fetchOrdersSuccess(state, action);
    case actionTypes.FETCH_ORDERS_FAIL: return fetchOrdersFail(state, action);
    default: return state;
  }
};

export default reducer;
```

### Auth Reducer

**Location**: `/src/store/reducers/auth.js`

```javascript
import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
  token: null,
  userId: null,
  error: null,
  loading: false,
  authRedirectPath: '/'
};

const authStart = (state, action) => {
  return updateObject(state, { error: null, loading: true });
};

const authSuccess = (state, action) => {
  return updateObject(state, {
    token: action.idToken,
    userId: action.userId,
    error: null,
    loading: false
  });
};

const authFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false
  });
};

const authLogout = (state, action) => {
  return updateObject(state, { token: null, userId: null });
};

const setAuthRedirectPath = (state, action) => {
  return updateObject(state, { authRedirectPath: action.path });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START: return authStart(state, action);
    case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);
    case actionTypes.AUTH_FAIL: return authFail(state, action);
    case actionTypes.AUTH_LOGOUT: return authLogout(state, action);
    case actionTypes.SET_AUTH_REDIRECT_PATH: return setAuthRedirectPath(state, action);
    default: return state;
  }
};

export default reducer;
```

## Redux-Saga

Redux-Saga uses **generator functions** to handle side effects. Sagas are long-running background threads that listen for specific actions.

### Root Saga

**Location**: `/src/store/sagas/index.js`

```javascript
import { takeEvery, all, takeLatest } from 'redux-saga/effects';

import * as actionTypes from '../actions/actionTypes';
import {
  logoutSaga,
  checkAuthTimeoutSaga,
  authUserSaga,
  authCheckStateSaga
} from './auth';
import { initIngredientsSaga } from './burgerBuilder';
import { purchaseBurgerSaga, fetchOrdersSaga } from './order';

export function* watchAuth() {
  yield all([
    takeEvery(actionTypes.AUTH_INITIATE_LOGOUT, logoutSaga),
    takeEvery(actionTypes.AUTH_CHECK_TIMEOUT, checkAuthTimeoutSaga),
    takeEvery(actionTypes.AUTH_USER, authUserSaga),
    takeEvery(actionTypes.AUTH_CHECK_STATE, authCheckStateSaga)
  ]);
}

export function* watchBurgerBuilder() {
  yield takeEvery(actionTypes.INIT_INGREDIENTS, initIngredientsSaga);
}

export function* watchOrder() {
  yield takeLatest(actionTypes.PURCHASE_BURGER, purchaseBurgerSaga);
  yield takeEvery(actionTypes.FETCH_ORDERS, fetchOrdersSaga);
}
```

### Burger Builder Saga

**Location**: `/src/store/sagas/burgerBuilder.js`

```javascript
import { put } from 'redux-saga/effects';
import axios from '../../axios-orders';
import * as actions from '../actions/index';

export function* initIngredientsSaga(action) {
  try {
    const response = yield axios.get('/ingredients.json');
    yield put(actions.setIngredients(response.data));
  } catch (error) {
    yield put(actions.fetchIngredientsFailed());
  }
}
```

### Order Saga

**Location**: `/src/store/sagas/order.js`

```javascript
import { put } from 'redux-saga/effects';
import axios from '../../axios-orders';
import * as actions from '../actions/index';

export function* purchaseBurgerSaga(action) {
  yield put(actions.purchaseBurgerStart());
  try {
    const response = yield axios.post(
      '/orders.json?auth=' + action.token,
      action.orderData
    );
    yield put(actions.purchaseBurgerSuccess(response.data.name, action.orderData));
  } catch (error) {
    yield put(actions.purchaseBurgerFail(error));
  }
}

export function* fetchOrdersSaga(action) {
  yield put(actions.fetchOrdersStart());
  const queryParams =
    '?auth=' + action.token +
    '&orderBy="userId"&equalTo="' + action.userId + '"';
  try {
    const response = yield axios.get('/orders.json' + queryParams);
    const fetchedOrders = [];
    for (let key in response.data) {
      fetchedOrders.push({
        ...response.data[key],
        id: key
      });
    }
    yield put(actions.fetchOrdersSuccess(fetchedOrders));
  } catch (error) {
    yield put(actions.fetchOrdersFail(error));
  }
}
```

### Auth Saga

**Location**: `/src/store/sagas/auth.js`

```javascript
import { put, delay } from 'redux-saga/effects';
import axios from 'axios';
import * as actions from '../actions/index';

export function* logoutSaga(action) {
  yield localStorage.removeItem('token');
  yield localStorage.removeItem('expirationDate');
  yield localStorage.removeItem('userId');
  yield put(actions.logoutSucceed());
}

export function* checkAuthTimeoutSaga(action) {
  yield delay(action.expirationTime * 1000);
  yield put(actions.logout());
}

export function* authUserSaga(action) {
  yield put(actions.authStart());
  const authData = {
    email: action.email,
    password: action.password,
    returnSecureToken: true
  };

  let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=YOUR_API_KEY';
  if (!action.isSignup) {
    url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=YOUR_API_KEY';
  }

  try {
    const response = yield axios.post(url, authData);
    const expirationDate = yield new Date(
      new Date().getTime() + response.data.expiresIn * 1000
    );
    yield localStorage.setItem('token', response.data.idToken);
    yield localStorage.setItem('expirationDate', expirationDate);
    yield localStorage.setItem('userId', response.data.localId);
    yield put(actions.authSuccess(response.data.idToken, response.data.localId));
    yield put(actions.checkAuthTimeout(response.data.expiresIn));
  } catch (error) {
    yield put(actions.authFail(error.response.data.error));
  }
}

export function* authCheckStateSaga(action) {
  const token = yield localStorage.getItem('token');
  if (!token) {
    yield put(actions.logout());
  } else {
    const expirationDate = yield new Date(localStorage.getItem('expirationDate'));
    if (expirationDate <= new Date()) {
      yield put(actions.logout());
    } else {
      const userId = yield localStorage.getItem('userId');
      yield put(actions.authSuccess(token, userId));
      yield put(
        actions.checkAuthTimeout(
          (expirationDate.getTime() - new Date().getTime()) / 1000
        )
      );
    }
  }
}
```

### Saga Effects

| Effect | Purpose | Example |
|--------|---------|---------|
| `put()` | Dispatch an action | `yield put(actions.authSuccess(token))` |
| `call()` | Call a function | `yield call(axios.get, '/api')` |
| `select()` | Get state | `yield select(state => state.auth.token)` |
| `takeEvery()` | Listen to all actions | `takeEvery(AUTH_USER, authSaga)` |
| `takeLatest()` | Cancel previous, take latest | `takeLatest(FETCH_DATA, fetchSaga)` |
| `delay()` | Pause execution | `yield delay(1000)` |
| `all()` | Run sagas in parallel | `yield all([saga1(), saga2()])` |
| `race()` | Race between effects | `yield race({ task, cancel })` |

## Connecting Components

### Using Redux Hooks (Modern Approach)

```javascript
import { useSelector, useDispatch } from 'react-redux';
import * as actions from '../../store/actions/index';

const BurgerBuilder = props => {
  const dispatch = useDispatch();

  // Select state
  const ingredients = useSelector(state => state.burgerBuilder.ingredients);
  const totalPrice = useSelector(state => state.burgerBuilder.totalPrice);
  const error = useSelector(state => state.burgerBuilder.error);
  const isAuthenticated = useSelector(state => state.auth.token !== null);

  // Dispatch actions
  const onIngredientAdded = (ingName) => dispatch(actions.addIngredient(ingName));
  const onIngredientRemoved = (ingName) => dispatch(actions.removeIngredient(ingName));
  const onInitIngredients = () => dispatch(actions.initIngredients());
  const onInitPurchase = () => dispatch(actions.purchaseInit());

  // Use in component
  return (
    <BuildControls
      ingredientAdded={onIngredientAdded}
      ingredientRemoved={onIngredientRemoved}
      price={totalPrice}
    />
  );
};
```

### Using connect() (Legacy Approach)

```javascript
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';

const Orders = props => {
  // Use props.orders, props.loading, props.onFetchOrders
  return <div>...</div>;
};

const mapStateToProps = state => {
  return {
    orders: state.order.orders,
    loading: state.order.loading,
    token: state.auth.token,
    userId: state.auth.userId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchOrders: (token, userId) => dispatch(actions.fetchOrders(token, userId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Orders);
```

## Best Practices

### 1. Immutability

Always return new state objects:

```javascript
// ❌ BAD - Mutates state
state.ingredients.cheese = 1;
return state;

// ✅ GOOD - Returns new state
return {
  ...state,
  ingredients: {
    ...state.ingredients,
    cheese: 1
  }
};

// ✅ BETTER - Use utility function
return updateObject(state, {
  ingredients: updateObject(state.ingredients, { cheese: 1 })
});
```

### 2. Action Type Constants

Use constants to prevent typos:

```javascript
// ❌ BAD
dispatch({ type: 'ADD_INGREDINT' }); // Typo!

// ✅ GOOD
import * as actionTypes from './actionTypes';
dispatch({ type: actionTypes.ADD_INGREDIENT });
```

### 3. Separate Saga and Reducer Actions

```javascript
// Saga action - triggers async operation
export const initIngredients = () => ({
  type: actionTypes.INIT_INGREDIENTS
});

// Reducer actions - update state
export const setIngredients = (ingredients) => ({
  type: actionTypes.SET_INGREDIENTS,
  ingredients
});

export const fetchIngredientsFailed = () => ({
  type: actionTypes.FETCH_INGREDIENTS_FAILED
});
```

### 4. Normalize State

```javascript
// ❌ BAD - Nested data
orders: {
  '123': {
    items: [...],
    user: { id: 'abc', name: 'John' }
  }
}

// ✅ GOOD - Flat structure
orders: ['123'],
ordersById: {
  '123': { items: [...], userId: 'abc' }
},
users: {
  'abc': { id: 'abc', name: 'John' }
}
```

### 5. Use Selectors

```javascript
// ❌ BAD - Direct state access
const price = useSelector(state => state.burgerBuilder.totalPrice);
const building = useSelector(state => state.burgerBuilder.building);

// ✅ GOOD - Memoized selectors (with reselect)
const burgerState = useSelector(state => state.burgerBuilder);
const { totalPrice, building } = burgerState;
```

### 6. Handle Loading and Error States

Always track loading and error states for async operations:

```javascript
const initialState = {
  data: null,
  loading: false,
  error: null
};
```

### 7. Use TypeScript (Future Enhancement)

```typescript
interface BurgerBuilderState {
  ingredients: Ingredients | null;
  totalPrice: number;
  error: boolean;
  building: boolean;
}

const initialState: BurgerBuilderState = {
  ingredients: null,
  totalPrice: 4,
  error: false,
  building: false
};
```

---

**Last Updated**: 2025-11-04
