# Architecture Documentation

## Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Project Structure](#project-structure)
4. [Component Architecture](#component-architecture)
5. [State Management Architecture](#state-management-architecture)
6. [Routing Architecture](#routing-architecture)
7. [Data Flow](#data-flow)
8. [Performance Optimizations](#performance-optimizations)
9. [Error Handling](#error-handling)

## Overview

BurgerBuilderApp follows a modern React architecture with:
- **Unidirectional data flow** via Redux
- **Side effect isolation** via Redux-Saga
- **Component separation** (Presentational vs Container)
- **Code splitting** for optimal bundle size
- **Modular structure** for maintainability

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              React Application (SPA)                   │ │
│  │                                                        │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────┐  │ │
│  │  │   Router     │  │  Components  │  │    HOCs    │  │ │
│  │  │ (v5)         │  │              │  │            │  │ │
│  │  └──────┬───────┘  └──────┬───────┘  └─────┬──────┘  │ │
│  │         │                  │                │         │ │
│  │         └──────────────────┼────────────────┘         │ │
│  │                            │                          │ │
│  │                    ┌───────▼────────┐                 │ │
│  │                    │  Redux Store   │                 │ │
│  │                    │                │                 │ │
│  │                    │  ┌──────────┐  │                 │ │
│  │                    │  │Reducers  │  │                 │ │
│  │                    │  └────┬─────┘  │                 │ │
│  │                    │       │        │                 │ │
│  │                    │  ┌────▼─────┐  │                 │ │
│  │                    │  │  Sagas   │  │                 │ │
│  │                    │  └────┬─────┘  │                 │ │
│  │                    └───────┼────────┘                 │ │
│  │                            │                          │ │
│  └────────────────────────────┼──────────────────────────┘ │
│                                │                            │
│                         ┌──────▼────────┐                   │
│                         │  Axios HTTP   │                   │
│                         └──────┬────────┘                   │
└────────────────────────────────┼──────────────────────────┘
                                 │
                         ┌───────▼────────┐
                         │    Firebase    │
                         │                │
                         │  ┌──────────┐  │
                         │  │Realtime  │  │
                         │  │Database  │  │
                         │  └──────────┘  │
                         │                │
                         │  ┌──────────┐  │
                         │  │   Auth   │  │
                         │  │Toolkit   │  │
                         │  └──────────┘  │
                         └────────────────┘
```

## Project Structure

```
BurgerBuilderApp/
│
├── public/                          # Static assets
│   ├── index.html                  # HTML template
│   └── manifest.json               # PWA manifest
│
├── src/                            # Application source
│   ├── index.js                    # Entry point + Redux setup
│   ├── App.js                      # Root component + routing
│   ├── axios-orders.js             # Axios configuration
│   │
│   ├── assets/                     # Images, fonts, etc.
│   │   └── images/
│   │
│   ├── components/                 # Presentational Components
│   │   ├── Burger/                 # Burger visualization
│   │   │   ├── Burger.js
│   │   │   ├── BurgerIngredient/
│   │   │   ├── BuildControls/
│   │   │   └── OrderSummary/
│   │   │
│   │   ├── Navigation/             # Navigation components
│   │   │   ├── Toolbar/
│   │   │   ├── SideDrawer/
│   │   │   └── NavigationItems/
│   │   │
│   │   ├── Order/                  # Order display
│   │   │   ├── Order.js
│   │   │   └── CheckoutSummary/
│   │   │
│   │   ├── UI/                     # Reusable UI components
│   │   │   ├── Modal/
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Spinner/
│   │   │   ├── Backdrop/
│   │   │   └── withErrorHandler/
│   │   │
│   │   └── Logo/
│   │
│   ├── containers/                 # Smart/Container Components
│   │   ├── BurgerBuilder/          # Main burger builder
│   │   ├── Checkout/               # Checkout flow
│   │   ├── Orders/                 # Order history
│   │   └── Auth/                   # Authentication
│   │
│   ├── hoc/                        # Higher-Order Components
│   │   ├── Layout/                 # App layout wrapper
│   │   ├── Auxiliary/              # Fragment wrapper
│   │   └── asyncComponent/         # Code splitting (legacy)
│   │
│   ├── hooks/                      # Custom React Hooks
│   │   └── http-error-handler.js
│   │
│   ├── store/                      # Redux State Management
│   │   ├── actions/                # Action creators
│   │   │   ├── actionTypes.js
│   │   │   ├── auth.js
│   │   │   ├── burgerBuilder.js
│   │   │   ├── order.js
│   │   │   └── index.js
│   │   │
│   │   ├── reducers/               # Pure reducers
│   │   │   ├── auth.js
│   │   │   ├── burgerBuilder.js
│   │   │   └── order.js
│   │   │
│   │   └── sagas/                  # Side effects
│   │       ├── auth.js
│   │       ├── burgerBuilder.js
│   │       ├── order.js
│   │       └── index.js
│   │
│   └── shared/                     # Shared utilities
│       └── utility.js
│
├── config/                         # Build configuration
│   ├── webpack.config.js
│   └── webpackDevServer.config.js
│
├── scripts/                        # Build scripts
│   ├── start.js
│   ├── build.js
│   └── test.js
│
├── docs/                           # Documentation
│
└── package.json                    # Dependencies
```

### Folder Responsibilities

| Folder | Purpose | Contains |
|--------|---------|----------|
| `components/` | Presentational components | UI-only, reusable, no Redux |
| `containers/` | Smart components | Redux-connected, business logic |
| `hoc/` | Higher-Order Components | Component wrappers, shared logic |
| `hooks/` | Custom React Hooks | Reusable stateful logic |
| `store/actions/` | Action creators | Functions returning action objects |
| `store/reducers/` | Pure reducers | State transformation functions |
| `store/sagas/` | Side effects | Async operations, API calls |
| `shared/` | Utilities | Pure helper functions |

## Component Architecture

### Component Hierarchy

```
App (Root)
│
├── Layout (HOC)
│   ├── Toolbar
│   │   ├── Logo
│   │   └── NavigationItems
│   │
│   ├── SideDrawer
│   │   ├── Logo
│   │   └── NavigationItems
│   │
│   └── {children} (Route Components)
│       │
│       ├── BurgerBuilder (Container)
│       │   ├── Burger
│       │   │   └── BurgerIngredient (x4)
│       │   ├── BuildControls
│       │   │   └── BuildControl (x4)
│       │   └── Modal
│       │       └── OrderSummary
│       │
│       ├── Auth (Container)
│       │   └── Input (xN)
│       │
│       ├── Checkout (Container)
│       │   ├── CheckoutSummary
│       │   │   └── Burger
│       │   └── ContactData
│       │       └── Input (xN)
│       │
│       └── Orders (Container)
│           └── Order (xN)
```

### Component Types

#### 1. Presentational Components
**Location**: `/src/components/`

**Characteristics**:
- No Redux connection
- Receive data via props
- Emit events via callback props
- Stateless or local state only
- Highly reusable

**Examples**:
- `Burger` - Displays burger visualization
- `Button` - Reusable button component
- `Modal` - Generic modal dialog
- `Input` - Form input with validation display

#### 2. Container Components
**Location**: `/src/containers/`

**Characteristics**:
- Connected to Redux store
- Dispatch actions
- Pass data to presentational components
- Handle business logic
- Route-level components

**Examples**:
- `BurgerBuilder` - Manages burger building state
- `Auth` - Handles authentication logic
- `Checkout` - Manages checkout flow
- `Orders` - Fetches and displays orders

#### 3. Higher-Order Components (HOCs)
**Location**: `/src/hoc/`

**Characteristics**:
- Wrap other components
- Add functionality
- Share logic across components
- Return enhanced components

**Examples**:
- `Layout` - Provides app structure and navigation
- `withErrorHandler` - Adds error handling to components
- `Auxiliary` - Fragment wrapper for multiple children

### Component Communication

```
┌─────────────────────────────────────────────────────────┐
│                     Redux Store                          │
│                                                          │
│  State: { burgerBuilder, order, auth }                   │
└───────────┬─────────────────────────┬───────────────────┘
            │ dispatch()              │ useSelector()
            │                         │
    ┌───────▼────────┐        ┌──────▼─────────┐
    │  Container A   │        │  Container B   │
    │  (BurgerBuilder)│        │  (Orders)      │
    └───────┬────────┘        └──────┬─────────┘
            │ props                  │ props
            │                        │
    ┌───────▼────────┐        ┌──────▼─────────┐
    │Presentational A│        │Presentational B│
    │   (Burger)     │        │   (Order)      │
    └────────────────┘        └────────────────┘
```

## State Management Architecture

### Redux Store Structure

```javascript
{
  // Burger Builder State
  burgerBuilder: {
    ingredients: {
      salad: number,
      bacon: number,
      cheese: number,
      meat: number
    },
    totalPrice: number,
    error: boolean,
    building: boolean
  },

  // Order Management State
  order: {
    orders: [
      {
        id: string,
        ingredients: object,
        price: number,
        orderData: object,
        userId: string
      }
    ],
    loading: boolean,
    purchased: boolean,
    fetched: boolean
  },

  // Authentication State
  auth: {
    token: string | null,
    userId: string | null,
    email: string | null,
    error: string | null,
    loading: boolean,
    authRedirectPath: string
  }
}
```

### Middleware Stack

```
Action Dispatched
      │
      ▼
┌─────────────────┐
│ Logger          │  (Development only - logs actions)
│ Middleware      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Redux-Saga      │  (Primary - handles async operations)
│ Middleware      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Redux-Thunk     │  (Available but unused)
│ Middleware      │
└────────┬────────┘
         │
         ▼
    Reducers
         │
         ▼
   State Updated
```

### Saga Architecture

```
┌──────────────────────────────────────────────────────┐
│                   Root Saga                          │
│                                                      │
│  all([                                               │
│    watchAuth(),                                      │
│    watchBurgerBuilder(),                            │
│    watchOrder()                                      │
│  ])                                                  │
└───────┬──────────────┬─────────────┬────────────────┘
        │              │             │
        ▼              ▼             ▼
  ┌─────────┐   ┌──────────┐  ┌──────────┐
  │  Auth   │   │  Burger  │  │  Order   │
  │ Watchers│   │ Watchers │  │ Watchers │
  └────┬────┘   └────┬─────┘  └────┬─────┘
       │             │              │
       │             │              │
  ┌────▼─────┐  ┌───▼────┐    ┌────▼─────┐
  │ authUser │  │ init   │    │ purchase │
  │   Saga   │  │Ingred. │    │ Burger   │
  └────┬─────┘  │ Saga   │    │  Saga    │
       │        └───┬────┘    └────┬─────┘
       │            │              │
       ▼            ▼              ▼
  API Calls    API Calls      API Calls
       │            │              │
       ▼            ▼              ▼
  Actions      Actions        Actions
  Dispatched   Dispatched     Dispatched
```

## Routing Architecture

### Route Configuration

```javascript
<Switch>
  {/* Public Routes */}
  <Route path="/" exact component={BurgerBuilder} />

  {/* Authenticated Routes */}
  {isAuthenticated && (
    <>
      <Route path="/checkout" component={Checkout} />
      <Route path="/orders" component={Orders} />
      <Route path="/logout" component={Logout} />
    </>
  )}

  {/* Unauthenticated Only */}
  {!isAuthenticated && (
    <Route path="/auth" component={Auth} />
  )}

  {/* Redirect to home */}
  <Redirect to="/" />
</Switch>
```

### Route Protection Strategy

1. **Conditional Rendering**: Routes rendered based on `isAuthenticated` state
2. **Dynamic Route Array**: Routes filtered before rendering
3. **Redirect Handling**: Unauthenticated users redirected to `/auth`
4. **Auth Redirect Path**: Stores intended path for post-login redirect

### Code Splitting Strategy

```javascript
// Lazy-loaded components
const Auth = React.lazy(() => import('./containers/Auth/Auth'));
const Checkout = React.lazy(() => import('./containers/Checkout/Checkout'));
const Orders = React.lazy(() => import('./containers/Orders/Orders'));

// Suspense boundary
<Suspense fallback={<Spinner />}>
  <Route path="/auth" component={Auth} />
  {/* ... other lazy routes */}
</Suspense>
```

**Benefits**:
- Reduced initial bundle size
- Faster initial page load
- On-demand loading of authenticated features

## Data Flow

### Complete Data Flow Example: Adding an Ingredient

```
┌─────────────────────────────────────────────────────────┐
│ 1. User clicks "Add Cheese" button                       │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│ 2. BuildControl calls onIngredientAdded('cheese')        │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│ 3. BurgerBuilder dispatches:                            │
│    dispatch(addIngredient('cheese'))                     │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│ 4. Action sent to Redux:                                │
│    { type: ADD_INGREDIENT, ingredientName: 'cheese' }   │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│ 5. burgerBuilderReducer receives action                 │
│    - Increments ingredients.cheese by 1                 │
│    - Adds cheese price (0.3) to totalPrice              │
│    - Sets building to true                              │
│    - Returns new state                                  │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│ 6. Redux store updates                                  │
│    State: { ingredients: { cheese: 1, ... },            │
│             totalPrice: 3.3, ... }                      │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│ 7. BurgerBuilder re-renders (useSelector hook)          │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│ 8. Burger component receives updated ingredients prop   │
│    Renders new BurgerIngredient for cheese              │
└─────────────────────────────────────────────────────────┘
```

### Async Data Flow Example: Placing an Order

```
User submits order
       │
       ▼
Container dispatches purchaseBurger(orderData)
       │
       ▼
Action: PURCHASE_BURGER
       │
       ▼
purchaseBurgerSaga() watches
       │
       ├─► Dispatches PURCHASE_BURGER_START
       │   (Reducer sets loading: true)
       │
       ├─► Makes POST request to Firebase
       │   axios.post('/orders.json', orderData)
       │
       ├─► On Success:
       │   │
       │   ├─► Dispatches PURCHASE_BURGER_SUCCESS
       │   │   (Reducer sets purchased: true, loading: false)
       │   │
       │   └─► Component redirects to /orders
       │
       └─► On Failure:
           │
           └─► Dispatches PURCHASE_BURGER_FAIL
               (Reducer sets loading: false, error)
```

## Performance Optimizations

### 1. Code Splitting
- Lazy loading of Auth, Checkout, Orders routes
- Reduces initial bundle size by ~30%
- Uses React.lazy() and Suspense

### 2. Memoization
```javascript
// Modal component
export default React.memo(
  Modal,
  (prevProps, nextProps) =>
    nextProps.show === prevProps.show &&
    nextProps.children === prevProps.children
);
```

### 3. useCallback Hooks
```javascript
// BurgerBuilder container
const onIngredientAdded = useCallback(
  (ingredientName) => dispatch(addIngredient(ingredientName)),
  [dispatch]
);
```

### 4. CSS Modules
- Scoped styles prevent global CSS bloat
- Webpack eliminates unused styles in production

### 5. Production Build Optimizations
- Minification (Terser)
- Tree shaking
- Code splitting
- Asset compression
- Cache busting with hashed filenames

## Error Handling

### Multi-Layer Error Strategy

#### 1. HTTP Error Handling (Hook)
```javascript
// /src/hooks/http-error-handler.js
useEffect(() => {
  const reqInterceptor = axios.interceptors.request.use(req => {
    // Clear previous errors
    return req;
  });

  const resInterceptor = axios.interceptors.response.use(
    res => res,
    error => {
      setError(error);
      return Promise.reject(error);
    }
  );

  // Cleanup
  return () => {
    axios.interceptors.request.eject(reqInterceptor);
    axios.interceptors.response.eject(resInterceptor);
  };
}, [axios]);
```

#### 2. Component-Level Error Handling (HOC)
```javascript
// /src/hoc/withErrorHandler/withErrorHandler.js
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

#### 3. Redux-Level Error Handling
```javascript
// In sagas
try {
  const response = yield axios.post('/orders.json', orderData);
  yield put(actions.purchaseBurgerSuccess(response.data));
} catch (error) {
  yield put(actions.purchaseBurgerFail(error));
}
```

### Error Flow Diagram

```
API Error Occurs
       │
       ▼
Axios Interceptor Catches
       │
       ▼
useHttpErrorHandler Sets Error State
       │
       ▼
withErrorHandler HOC Detects Error
       │
       ▼
Modal Displays Error Message
       │
       ▼
User Clicks Modal Backdrop
       │
       ▼
clearError() Called
       │
       ▼
Error State Cleared
       │
       ▼
Modal Closes
```

## Security Considerations

1. **Token Storage**: localStorage (XSS vulnerable, acceptable for learning project)
2. **Token Expiration**: Automatic logout via Redux-Saga
3. **Route Protection**: Conditional rendering based on auth state
4. **API Key**: Exposed in client (Firebase security rules should be configured)
5. **HTTPS**: Firebase endpoints use HTTPS

## Scalability Considerations

1. **Modular Structure**: Easy to add new features
2. **Saga Pattern**: Centralizes side effects, easy to test
3. **Redux Normalization**: Could be improved for large datasets
4. **Code Splitting**: Allows app to grow without affecting initial load
5. **Component Composition**: Reusable components reduce duplication

---

**Last Updated**: 2025-11-04
