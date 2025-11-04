# API Documentation

## Table of Contents

1. [Overview](#overview)
2. [Firebase Setup](#firebase-setup)
3. [Axios Configuration](#axios-configuration)
4. [API Endpoints](#api-endpoints)
5. [Authentication API](#authentication-api)
6. [Request/Response Examples](#requestresponse-examples)
7. [Error Handling](#error-handling)

## Overview

BurgerBuilderApp uses **Firebase** as its backend service:

- **Firebase Realtime Database**: For storing ingredients and orders
- **Firebase Identity Toolkit**: For user authentication

All HTTP requests are made using **Axios**, a promise-based HTTP client.

### Base Configuration

- **Firebase Database URL**: `https://react-burger-app-cdd66.firebaseio.com/`
- **Authentication**: Firebase Identity Toolkit (REST API)
- **HTTP Client**: Axios 0.19.0

## Firebase Setup

### Firebase Project Structure

```
react-burger-app-cdd66/
├── Realtime Database
│   ├── /ingredients
│   │   ├── salad: 0
│   │   ├── bacon: 0
│   │   ├── cheese: 0
│   │   └── meat: 0
│   │
│   └── /orders
│       ├── {orderId1}
│       │   ├── ingredients: {...}
│       │   ├── orderData: {...}
│       │   ├── price: number
│       │   └── userId: string
│       │
│       └── {orderId2}
│           └── ...
│
└── Authentication
    └── Email/Password provider enabled
```

### Firebase Security Rules

**Recommended rules** (for production):

```json
{
  "rules": {
    "ingredients": {
      ".read": true,
      ".write": false
    },
    "orders": {
      ".read": "auth != null",
      ".write": "auth != null",
      ".indexOn": ["userId"]
    }
  }
}
```

**Current rules** (development - less secure):

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

## Axios Configuration

### Axios Instance Setup

**Location**: `/src/axios-orders.js`

```javascript
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://react-burger-app-cdd66.firebaseio.com/'
});

export default instance;
```

### Request Interceptors

Implemented in custom hook for error handling:

**Location**: `/src/hooks/http-error-handler.js`

```javascript
useEffect(() => {
  const reqInterceptor = axiosInstance.interceptors.request.use(req => {
    setError(null); // Clear previous errors
    return req;
  });

  const resInterceptor = axiosInstance.interceptors.response.use(
    res => res,
    err => {
      setError(err);
      return Promise.reject(err);
    }
  );

  // Cleanup
  return () => {
    axiosInstance.interceptors.request.eject(reqInterceptor);
    axiosInstance.interceptors.response.eject(resInterceptor);
  };
}, [axiosInstance]);
```

## API Endpoints

### 1. Fetch Ingredients

**Endpoint**: `GET /ingredients.json`

**Purpose**: Retrieve initial ingredient quantities

**Authentication**: Not required

**Request**:
```http
GET https://react-burger-app-cdd66.firebaseio.com/ingredients.json
```

**Response**:
```json
{
  "salad": 0,
  "bacon": 0,
  "cheese": 0,
  "meat": 0
}
```

**Saga Implementation**:
```javascript
// src/store/sagas/burgerBuilder.js
export function* initIngredientsSaga(action) {
  try {
    const response = yield axios.get('/ingredients.json');
    yield put(actions.setIngredients(response.data));
  } catch (error) {
    yield put(actions.fetchIngredientsFailed());
  }
}
```

### 2. Create Order

**Endpoint**: `POST /orders.json?auth={token}`

**Purpose**: Submit a new burger order

**Authentication**: Required (token in query param)

**Request**:
```http
POST https://react-burger-app-cdd66.firebaseio.com/orders.json?auth={idToken}
Content-Type: application/json

{
  "ingredients": {
    "salad": 1,
    "bacon": 2,
    "cheese": 1,
    "meat": 1
  },
  "price": 7.2,
  "orderData": {
    "name": "John Doe",
    "street": "123 Main St",
    "zipCode": "12345",
    "country": "USA",
    "email": "john@example.com",
    "deliveryMethod": "fastest"
  },
  "userId": "abc123xyz"
}
```

**Response**:
```json
{
  "name": "-MjK8uJh7ePqD5vZ_abc"
}
```

Note: `name` is the auto-generated Firebase key (order ID)

**Saga Implementation**:
```javascript
// src/store/sagas/order.js
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
```

### 3. Fetch Orders

**Endpoint**: `GET /orders.json?auth={token}&orderBy="userId"&equalTo="{userId}"`

**Purpose**: Retrieve all orders for a specific user

**Authentication**: Required (token in query param)

**Request**:
```http
GET https://react-burger-app-cdd66.firebaseio.com/orders.json?auth={idToken}&orderBy="userId"&equalTo="abc123xyz"
```

**Query Parameters**:
- `auth`: Firebase ID token
- `orderBy`: Field to query by (must be indexed in Firebase rules)
- `equalTo`: Value to match

**Response**:
```json
{
  "-MjK8uJh7ePqD5vZ_abc": {
    "ingredients": {
      "salad": 1,
      "bacon": 2,
      "cheese": 1,
      "meat": 1
    },
    "price": 7.2,
    "orderData": {
      "name": "John Doe",
      "street": "123 Main St",
      "zipCode": "12345",
      "country": "USA",
      "email": "john@example.com",
      "deliveryMethod": "fastest"
    },
    "userId": "abc123xyz"
  },
  "-MjK9xYz3fGhI6jK_def": {
    "ingredients": {
      "salad": 2,
      "bacon": 1,
      "cheese": 2,
      "meat": 2
    },
    "price": 9.5,
    "orderData": {
      "name": "John Doe",
      "street": "123 Main St",
      "zipCode": "12345",
      "country": "USA",
      "email": "john@example.com",
      "deliveryMethod": "cheapest"
    },
    "userId": "abc123xyz"
  }
}
```

**Saga Implementation**:
```javascript
// src/store/sagas/order.js
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

## Authentication API

### Firebase Identity Toolkit

Firebase Authentication uses the Identity Toolkit REST API:

**Base URL**: `https://identitytoolkit.googleapis.com/v1/accounts`

### 1. Sign Up

**Endpoint**: `POST /accounts:signUp?key={apiKey}`

**Purpose**: Create a new user account

**Request**:
```http
POST https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=YOUR_API_KEY
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "returnSecureToken": true
}
```

**Response**:
```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjFhYzJlMTk3Z...",
  "email": "user@example.com",
  "refreshToken": "AIwUaOmXPmDWzQi...",
  "expiresIn": "3600",
  "localId": "abc123xyz"
}
```

**Response Fields**:
- `idToken`: JWT token for authenticated requests
- `email`: User's email address
- `refreshToken`: Token for refreshing the ID token
- `expiresIn`: Token expiration time in seconds (usually 3600 = 1 hour)
- `localId`: User ID (used as `userId` in the app)

### 2. Sign In

**Endpoint**: `POST /accounts:signInWithPassword?key={apiKey}`

**Purpose**: Authenticate an existing user

**Request**:
```http
POST https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=YOUR_API_KEY
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "returnSecureToken": true
}
```

**Response**: Same as Sign Up response

### Auth Saga Implementation

**Location**: `/src/store/sagas/auth.js`

```javascript
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
```

### Token Management

#### Storing Token

```javascript
localStorage.setItem('token', idToken);
localStorage.setItem('expirationDate', expirationDate.toISOString());
localStorage.setItem('userId', userId);
```

#### Automatic Logout on Expiration

```javascript
export function* checkAuthTimeoutSaga(action) {
  yield delay(action.expirationTime * 1000);
  yield put(actions.logout());
}
```

#### Restoring Session on App Load

```javascript
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

## Request/Response Examples

### Complete Order Submission Flow

#### 1. User builds burger and clicks "Order Now"
```javascript
// Dispatch action
dispatch(purchaseBurger(orderData, token));
```

#### 2. Saga intercepts action
```javascript
// Action payload
{
  type: 'PURCHASE_BURGER',
  orderData: {
    ingredients: { salad: 1, bacon: 2, cheese: 1, meat: 1 },
    price: 7.2,
    orderData: {
      name: 'John Doe',
      street: '123 Main St',
      zipCode: '12345',
      country: 'USA',
      email: 'john@example.com',
      deliveryMethod: 'fastest'
    },
    userId: 'abc123xyz'
  },
  token: 'eyJhbGciOiJSUzI1NiIs...'
}
```

#### 3. HTTP Request sent
```http
POST /orders.json?auth=eyJhbGciOiJSUzI1NiIs...
Content-Type: application/json

{
  "ingredients": { "salad": 1, "bacon": 2, "cheese": 1, "meat": 1 },
  "price": 7.2,
  "orderData": {
    "name": "John Doe",
    "street": "123 Main St",
    "zipCode": "12345",
    "country": "USA",
    "email": "john@example.com",
    "deliveryMethod": "fastest"
  },
  "userId": "abc123xyz"
}
```

#### 4. Firebase Response
```json
{
  "name": "-MjK8uJh7ePqD5vZ_abc"
}
```

#### 5. Success Action Dispatched
```javascript
{
  type: 'PURCHASE_BURGER_SUCCESS',
  orderId: '-MjK8uJh7ePqD5vZ_abc',
  orderData: { /* original order data */ }
}
```

## Error Handling

### API Error Types

#### 1. Network Errors
```javascript
{
  message: 'Network Error',
  code: 'ERR_NETWORK'
}
```

**Handling**:
```javascript
catch (error) {
  if (error.message === 'Network Error') {
    // Show "No internet connection" message
  }
}
```

#### 2. Firebase Auth Errors
```json
{
  "error": {
    "code": 400,
    "message": "EMAIL_EXISTS",
    "errors": [
      {
        "message": "EMAIL_EXISTS",
        "domain": "global",
        "reason": "invalid"
      }
    ]
  }
}
```

**Common Error Messages**:
- `EMAIL_EXISTS`: Email already in use
- `INVALID_EMAIL`: Malformed email
- `WEAK_PASSWORD`: Password too weak (< 6 characters)
- `EMAIL_NOT_FOUND`: No user with that email
- `INVALID_PASSWORD`: Wrong password
- `USER_DISABLED`: Account disabled
- `TOO_MANY_ATTEMPTS_TRY_LATER`: Too many failed attempts

#### 3. Firebase Database Errors
```json
{
  "error": "Permission denied"
}
```

### Error Handling Strategy

#### Global Error Handler (HOC)
```javascript
// src/hoc/withErrorHandler/withErrorHandler.js
export default (WrappedComponent, axios) => {
  return props => {
    const [error, clearError] = useHttpErrorHandler(axios);

    return (
      <>
        <Modal show={error} modalClosed={clearError}>
          {error ? error.message : null}
        </Modal>
        <WrappedComponent {...props} />
      </>
    );
  };
};
```

#### Usage
```javascript
export default withErrorHandler(BurgerBuilder, axios);
```

#### Saga Error Handling
```javascript
try {
  const response = yield axios.get('/ingredients.json');
  yield put(actions.setIngredients(response.data));
} catch (error) {
  yield put(actions.fetchIngredientsFailed());
}
```

### Error State in Redux
```javascript
const initialState = {
  data: null,
  loading: false,
  error: null  // Store error message or boolean
};
```

## API Best Practices

### 1. Always Use Token for Protected Endpoints
```javascript
axios.post('/orders.json?auth=' + token, orderData);
```

### 2. Handle Loading States
```javascript
// Before request
yield put(actions.purchaseBurgerStart()); // sets loading: true

// After response
yield put(actions.purchaseBurgerSuccess(...)); // sets loading: false
```

### 3. Query Optimization
```javascript
// Filter on server side (Firebase)
const queryParams = '?orderBy="userId"&equalTo="' + userId + '"';

// NOT client side filtering
const allOrders = axios.get('/orders.json');
const myOrders = allOrders.filter(o => o.userId === userId);
```

### 4. Error Recovery
```javascript
catch (error) {
  // Log error for debugging
  console.error('API Error:', error);

  // Dispatch failure action
  yield put(actions.fetchOrdersFail(error));

  // Don't expose sensitive error details to user
  // Show user-friendly message instead
}
```

### 5. Token Refresh (Not Implemented)
```javascript
// Future enhancement: Refresh token before expiration
if (isTokenExpiringSoon(expirationDate)) {
  yield refreshToken(refreshToken);
}
```

---

**Last Updated**: 2025-11-04
