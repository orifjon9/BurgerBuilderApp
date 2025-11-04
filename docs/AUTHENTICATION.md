# Authentication Documentation

## Table of Contents

1. [Overview](#overview)
2. [Authentication Flow](#authentication-flow)
3. [Sign Up Process](#sign-up-process)
4. [Sign In Process](#sign-in-process)
5. [Token Management](#token-management)
6. [Session Persistence](#session-persistence)
7. [Logout Process](#logout-process)
8. [Route Protection](#route-protection)
9. [Security Considerations](#security-considerations)

## Overview

BurgerBuilderApp uses **Firebase Identity Toolkit** for authentication with email/password credentials.

### Key Features

- Email/password authentication
- JWT token-based sessions
- Automatic token expiration
- Session persistence via localStorage
- Protected routes
- Automatic logout on token expiration

### Authentication State

Stored in Redux:
```javascript
{
  auth: {
    token: string | null,        // JWT token
    userId: string | null,        // User ID from Firebase
    email: string | null,         // User email
    error: string | null,         // Error message
    loading: boolean,             // Auth in progress
    authRedirectPath: string      // Redirect after auth
  }
}
```

## Authentication Flow

### Complete Flow Diagram

```
┌───────────────────────────────────────────────────────────┐
│  User visits app                                          │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │ App loads (index.js)  │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │ Dispatch              │
         │ authCheckState()      │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │ authCheckStateSaga()  │
         │ runs                  │
         └───────────┬───────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
    Token exists            No token
         │                       │
         ▼                       │
    Check expiration             │
         │                       │
    ┌────┴────┐                 │
    │         │                 │
    ▼         ▼                 ▼
  Valid   Expired           Logout
    │         │                 │
    ▼         ▼                 ▼
  Restore   Logout         Show Auth Page
  Session
    │
    ▼
  Setup auto-logout timer
    │
    ▼
  User authenticated
```

## Sign Up Process

### User Flow

1. User clicks "Burger Builder"
2. Tries to order → Redirected to `/auth`
3. Form shows "SIGN UP" mode by default
4. User enters email and password
5. Clicks "SUBMIT"
6. Loading spinner appears
7. Account created
8. Token stored
9. Redirected to intended page

### Technical Flow

```
User submits form
       │
       ▼
dispatch(auth(email, password, true))
       │
       ▼
authUserSaga() intercepts
       │
       ├─► dispatch(authStart())
       │   └─► Reducer sets loading: true
       │
       ├─► POST to Firebase signup endpoint
       │
       ├─► Success:
       │   │
       │   ├─► Extract: idToken, localId, expiresIn
       │   │
       │   ├─► Calculate expiration date
       │   │
       │   ├─► Store in localStorage:
       │   │   ├─ token
       │   │   ├─ expirationDate
       │   │   └─ userId
       │   │
       │   ├─► dispatch(authSuccess(token, userId))
       │   │   └─► Reducer updates state
       │   │
       │   └─► dispatch(checkAuthTimeout(expiresIn))
       │       └─► Sets up auto-logout timer
       │
       └─► Failure:
           │
           └─► dispatch(authFail(error))
               └─► Reducer sets error message
```

### Code Implementation

**Auth Container** (`/src/containers/Auth/Auth.js`):
```javascript
const submitHandler = (event) => {
  event.preventDefault();
  props.onAuth(
    authForm.email.value,
    authForm.password.value,
    isSignup  // true for sign up
  );
};
```

**Auth Saga** (`/src/store/sagas/auth.js`):
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

    // Calculate expiration date
    const expirationDate = yield new Date(
      new Date().getTime() + response.data.expiresIn * 1000
    );

    // Store in localStorage
    yield localStorage.setItem('token', response.data.idToken);
    yield localStorage.setItem('expirationDate', expirationDate);
    yield localStorage.setItem('userId', response.data.localId);

    // Update Redux state
    yield put(actions.authSuccess(response.data.idToken, response.data.localId));

    // Setup auto-logout
    yield put(actions.checkAuthTimeout(response.data.expiresIn));
  } catch (error) {
    yield put(actions.authFail(error.response.data.error));
  }
}
```

### Firebase Response

**Success**:
```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjFhYzJlMTk3Z...",
  "email": "user@example.com",
  "refreshToken": "AIwUaOmXPmDWzQi...",
  "expiresIn": "3600",
  "localId": "abc123xyz"
}
```

**Error**:
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

### Common Sign Up Errors

| Error Code | Meaning | User Action |
|------------|---------|-------------|
| `EMAIL_EXISTS` | Email already registered | Use sign in or different email |
| `INVALID_EMAIL` | Malformed email address | Check email format |
| `WEAK_PASSWORD` | Password < 6 characters | Use longer password |
| `OPERATION_NOT_ALLOWED` | Email/password auth disabled | Contact admin |

## Sign In Process

### User Flow

1. User on `/auth` page
2. Clicks "SWITCH TO SIGNIN"
3. Enters existing email and password
4. Clicks "SUBMIT"
5. Loading spinner appears
6. Authenticated
7. Redirected to intended page

### Technical Differences from Sign Up

Only difference is the API endpoint:

**Sign Up URL**:
```
https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=YOUR_API_KEY
```

**Sign In URL**:
```
https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=YOUR_API_KEY
```

### Code Implementation

**Toggle Sign In/Sign Up**:
```javascript
const switchAuthModeHandler = () => {
  setIsSignup(!isSignup);
};

<Button btnType="Danger" clicked={switchAuthModeHandler}>
  SWITCH TO {isSignup ? 'SIGNIN' : 'SIGNUP'}
</Button>
```

### Common Sign In Errors

| Error Code | Meaning | User Action |
|------------|---------|-------------|
| `EMAIL_NOT_FOUND` | No account with that email | Check email or sign up |
| `INVALID_PASSWORD` | Wrong password | Check password or reset |
| `USER_DISABLED` | Account disabled by admin | Contact support |
| `TOO_MANY_ATTEMPTS_TRY_LATER` | Rate limited | Wait and retry |

## Token Management

### Token Storage

**Where**: `localStorage`

**Keys**:
- `token`: JWT token string
- `expirationDate`: ISO date string
- `userId`: Firebase user ID

**Storage Code**:
```javascript
localStorage.setItem('token', response.data.idToken);
localStorage.setItem('expirationDate', expirationDate.toISOString());
localStorage.setItem('userId', response.data.localId);
```

### Token Expiration

Firebase tokens expire after **1 hour** (3600 seconds).

**Automatic Logout Timer**:
```javascript
export function* checkAuthTimeoutSaga(action) {
  yield delay(action.expirationTime * 1000);
  yield put(actions.logout());
}
```

**Calculation**:
```javascript
const expirationDate = new Date(
  new Date().getTime() + response.data.expiresIn * 1000
);
```

### Token Usage

**In API Requests**:
```javascript
axios.post('/orders.json?auth=' + token, orderData);
```

**In Redux State**:
```javascript
const token = useSelector(state => state.auth.token);
const isAuthenticated = useSelector(state => state.auth.token !== null);
```

### Token Validation

On app load:
```javascript
export function* authCheckStateSaga(action) {
  const token = yield localStorage.getItem('token');

  if (!token) {
    yield put(actions.logout());
  } else {
    const expirationDate = yield new Date(localStorage.getItem('expirationDate'));

    if (expirationDate <= new Date()) {
      // Token expired
      yield put(actions.logout());
    } else {
      // Token valid
      const userId = yield localStorage.getItem('userId');
      yield put(actions.authSuccess(token, userId));

      // Setup remaining time logout
      const remainingTime = (expirationDate.getTime() - new Date().getTime()) / 1000;
      yield put(actions.checkAuthTimeout(remainingTime));
    }
  }
}
```

## Session Persistence

### On App Load

**Entry Point** (`/src/index.js`):
```javascript
ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

// Check for existing session
store.dispatch(actions.authCheckState());
```

### Session Restoration Flow

```
App loads
   │
   ▼
dispatch(authCheckState())
   │
   ▼
authCheckStateSaga() runs
   │
   ├─► Read localStorage
   │   ├─ token
   │   ├─ expirationDate
   │   └─ userId
   │
   ├─► Token exists?
   │   │
   │   ├─► YES:
   │   │   │
   │   │   ├─► Expired?
   │   │   │   │
   │   │   │   ├─► YES: logout()
   │   │   │   │
   │   │   │   └─► NO:
   │   │   │       ├─ dispatch(authSuccess(token, userId))
   │   │   │       └─ dispatch(checkAuthTimeout(remaining))
   │   │   │
   │   └─► NO: logout()
   │
   ▼
Session restored or logged out
```

### Implementation

```javascript
useEffect(() => {
  props.onTryAutoSignup();
}, []);

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState())
  };
};
```

## Logout Process

### User-Initiated Logout

1. User clicks "Logout" in navigation
2. Routed to `/logout`
3. Logout component dispatches logout action
4. Redirected to home page

### Automatic Logout

1. Token expiration timer fires
2. Logout saga dispatched
3. User redirected to home
4. Must re-authenticate to access protected routes

### Implementation

**Logout Component** (`/src/containers/Auth/Logout/Logout.js`):
```javascript
const Logout = props => {
  const { onLogout } = props;

  useEffect(() => {
    onLogout();
  }, [onLogout]);

  return <Redirect to="/" />;
};

const mapDispatchToProps = dispatch => {
  return {
    onLogout: () => dispatch(actions.logout())
  };
};
```

**Logout Saga** (`/src/store/sagas/auth.js`):
```javascript
export function* logoutSaga(action) {
  yield localStorage.removeItem('token');
  yield localStorage.removeItem('expirationDate');
  yield localStorage.removeItem('userId');
  yield put(actions.logoutSucceed());
}
```

**Auth Reducer** (`/src/store/reducers/auth.js`):
```javascript
const authLogout = (state, action) => {
  return updateObject(state, {
    token: null,
    userId: null
  });
};
```

## Route Protection

### Protected Routes

Routes only accessible when authenticated:
- `/checkout`
- `/orders`
- `/logout`

### Unauthenticated-Only Routes

Routes only accessible when NOT authenticated:
- `/auth`

### Implementation

**App Component** (`/src/App.js`):
```javascript
const App = props => {
  const isAuthenticated = useSelector(state => state.auth.token !== null);

  let routes = (
    <Switch>
      <Route path="/auth" component={Auth} />
      <Route path="/" exact component={BurgerBuilder} />
      <Redirect to="/" />
    </Switch>
  );

  if (isAuthenticated) {
    routes = (
      <Switch>
        <Route path="/checkout" component={Checkout} />
        <Route path="/orders" component={Orders} />
        <Route path="/logout" component={Logout} />
        <Route path="/auth" component={Auth} />
        <Route path="/" exact component={BurgerBuilder} />
        <Redirect to="/" />
      </Switch>
    );
  }

  return (
    <Layout>
      <Suspense fallback={<Spinner />}>
        {routes}
      </Suspense>
    </Layout>
  );
};
```

### Redirect After Authentication

**Scenario**: User tries to access `/checkout` while unauthenticated

1. Burger builder shows "SIGN UP TO ORDER" button
2. User clicks → Routed to `/auth`
3. `authRedirectPath` set to `/checkout`
4. User authenticates
5. Redirected to `/checkout`

**Implementation**:
```javascript
// In BurgerBuilder
const purchaseHandler = () => {
  if (isAuthenticated) {
    setPurchasing(true);
  } else {
    onSetAuthRedirectPath('/checkout');
    props.history.push('/auth');
  }
};

// In Auth component
useEffect(() => {
  if (isAuthenticated && authRedirectPath !== '/') {
    props.history.push(authRedirectPath);
  }
}, [isAuthenticated, authRedirectPath, props.history]);
```

### Conditional Navigation

**NavigationItems** (`/src/components/Navigation/NavigationItems/NavigationItems.js`):
```javascript
<ul>
  <NavigationItem link="/" exact>Burger Builder</NavigationItem>

  {isAuthenticated && (
    <NavigationItem link="/orders">Orders</NavigationItem>
  )}

  {!isAuthenticated ? (
    <NavigationItem link="/auth">Authenticate</NavigationItem>
  ) : (
    <NavigationItem link="/logout">Logout</NavigationItem>
  )}
</ul>
```

## Security Considerations

### Current Implementation

#### Strengths
- Token-based authentication
- Automatic logout on expiration
- HTTPS endpoints (Firebase)
- Server-side validation (Firebase)
- Password minimum length (6 characters)

#### Weaknesses
1. **localStorage Vulnerability**:
   - Susceptible to XSS attacks
   - Token accessible to any JavaScript
   - Better: httpOnly cookies

2. **API Key Exposure**:
   - Firebase API key in client-side code
   - Acceptable with Firebase security rules
   - Better: Proxy through backend

3. **No Token Refresh**:
   - Token expires after 1 hour
   - User must re-authenticate
   - Better: Implement refresh token flow

4. **No CSRF Protection**:
   - Not needed for API tokens in query params
   - Would be needed with cookies

5. **Plain Text Storage**:
   - Token stored as plain text in localStorage
   - Acceptable for Firebase tokens
   - Sensitive data should not be stored client-side

### Recommended Improvements

1. **Implement Token Refresh**:
```javascript
export function* refreshTokenSaga(refreshToken) {
  const url = 'https://securetoken.googleapis.com/v1/token?key=YOUR_API_KEY';
  const data = {
    grant_type: 'refresh_token',
    refresh_token: refreshToken
  };

  try {
    const response = yield axios.post(url, data);
    // Update token and expiration
  } catch (error) {
    yield put(actions.logout());
  }
}
```

2. **Add Email Verification**:
```javascript
// After signup, send verification email
const verifyUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=YOUR_API_KEY';
yield axios.post(verifyUrl, {
  requestType: 'VERIFY_EMAIL',
  idToken: token
});
```

3. **Implement Password Reset**:
```javascript
const resetUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=YOUR_API_KEY';
yield axios.post(resetUrl, {
  requestType: 'PASSWORD_RESET',
  email: email
});
```

4. **Add Rate Limiting** (Server-side):
```javascript
// Firebase security rules
{
  "rules": {
    ".write": "auth != null &&
      now - root.child('users').child(auth.uid).child('lastWrite').val() > 1000"
  }
}
```

5. **Use Environment Variables**:
```javascript
// .env
REACT_APP_FIREBASE_API_KEY=your_api_key_here

// In code
const apiKey = process.env.REACT_APP_FIREBASE_API_KEY;
```

### Firebase Security Rules

**Current** (Development):
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

**Recommended** (Production):
```json
{
  "rules": {
    "ingredients": {
      ".read": true,
      ".write": false
    },
    "orders": {
      ".read": "auth != null && auth.uid == $uid",
      ".write": "auth != null && auth.uid == $uid",
      ".indexOn": ["userId"],
      "$uid": {
        ".validate": "newData.child('userId').val() == auth.uid"
      }
    }
  }
}
```

---

**Last Updated**: 2025-11-04
