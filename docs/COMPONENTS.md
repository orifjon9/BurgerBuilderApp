# Components Documentation

## Table of Contents

1. [Overview](#overview)
2. [Container Components](#container-components)
3. [Presentational Components](#presentational-components)
4. [Higher-Order Components](#higher-order-components)
5. [Custom Hooks](#custom-hooks)
6. [Component Patterns](#component-patterns)

## Overview

Components in BurgerBuilderApp follow the **Container/Presentational** pattern:

- **Container Components**: Smart components connected to Redux, handle business logic
- **Presentational Components**: Dumb components that only render UI based on props
- **Higher-Order Components (HOCs)**: Wrapper components that add functionality
- **Custom Hooks**: Reusable stateful logic

## Container Components

Container components are located in `/src/containers/` and are connected to the Redux store.

### BurgerBuilder

**Location**: `/src/containers/BurgerBuilder/BurgerBuilder.js`

**Purpose**: Main container for building burgers

**Redux State**:
```javascript
const ingredients = useSelector(state => state.burgerBuilder.ingredients);
const totalPrice = useSelector(state => state.burgerBuilder.totalPrice);
const error = useSelector(state => state.burgerBuilder.error);
const isAuthenticated = useSelector(state => state.auth.token !== null);
```

**Redux Actions**:
```javascript
const onIngredientAdded = (ingName) => dispatch(actions.addIngredient(ingName));
const onIngredientRemoved = (ingName) => dispatch(actions.removeIngredient(ingName));
const onInitIngredients = () => dispatch(actions.initIngredients());
const onInitPurchase = () => dispatch(actions.purchaseInit());
const onSetAuthRedirectPath = (path) => dispatch(actions.setAuthRedirectPath(path));
```

**Local State**:
```javascript
const [purchasing, setPurchasing] = useState(false);
```

**Key Features**:
- Adds/removes ingredients dynamically
- Calculates total price in real-time
- Shows order summary in modal
- Redirects to checkout on "Continue" click
- Fetches initial ingredients on mount

**Child Components**:
- `<Burger>` - Visual burger representation
- `<BuildControls>` - Ingredient add/remove buttons
- `<Modal>` - Order summary modal
- `<OrderSummary>` - Order details

**Example Usage**:
```javascript
<BurgerBuilder />
```

---

### Auth

**Location**: `/src/containers/Auth/Auth.js`

**Purpose**: User authentication (Sign In / Sign Up)

**Redux State**:
```javascript
const loading = useSelector(state => state.auth.loading);
const error = useSelector(state => state.auth.error);
const isAuthenticated = useSelector(state => state.auth.token !== null);
const buildingBurger = useSelector(state => state.burgerBuilder.building);
const authRedirectPath = useSelector(state => state.auth.authRedirectPath);
```

**Redux Actions**:
```javascript
const onAuth = (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup));
const onSetAuthRedirectPath = () => dispatch(actions.setAuthRedirectPath('/'));
```

**Local State**:
```javascript
const [authForm, setAuthForm] = useState({
  email: {
    elementType: 'input',
    elementConfig: { type: 'email', placeholder: 'Mail Address' },
    value: '',
    validation: { required: true, isEmail: true },
    valid: false,
    touched: false
  },
  password: {
    elementType: 'input',
    elementConfig: { type: 'password', placeholder: 'Password' },
    value: '',
    validation: { required: true, minLength: 6 },
    valid: false,
    touched: false
  }
});
const [isSignup, setIsSignup] = useState(true);
```

**Key Features**:
- Toggle between Sign In and Sign Up modes
- Form validation (email format, password length)
- Visual feedback for invalid fields
- Loading spinner during authentication
- Error display
- Auto-redirect after successful auth

**Child Components**:
- `<Input>` - Form input fields (x2)
- `<Button>` - Submit button
- `<Spinner>` - Loading indicator

---

### Checkout

**Location**: `/src/containers/Checkout/Checkout.js`

**Purpose**: Review order and enter delivery information

**Redux State**:
```javascript
const ingredients = useSelector(state => state.burgerBuilder.ingredients);
const totalPrice = useSelector(state => state.burgerBuilder.totalPrice);
const purchased = useSelector(state => state.order.purchased);
```

**Redux Actions**:
```javascript
const onInitPurchase = () => dispatch(actions.purchaseInit());
```

**Key Features**:
- Displays burger summary before checkout
- Routes to ContactData for delivery form
- Redirects to home if no ingredients selected
- Redirects to orders page after successful purchase

**Child Components**:
- `<CheckoutSummary>` - Visual burger summary
- `<Route>` - Routes to ContactData component

**Routes**:
```javascript
<Route
  path={props.match.path + '/contact-data'}
  component={ContactData}
/>
```

---

### ContactData

**Location**: `/src/containers/Checkout/ContactData/ContactData.js`

**Purpose**: Collect delivery information and submit order

**Redux State**:
```javascript
const ingredients = useSelector(state => state.burgerBuilder.ingredients);
const totalPrice = useSelector(state => state.burgerBuilder.totalPrice);
const loading = useSelector(state => state.order.loading);
const token = useSelector(state => state.auth.token);
const userId = useSelector(state => state.auth.userId);
```

**Redux Actions**:
```javascript
const onOrderBurger = (orderData, token) => dispatch(actions.purchaseBurger(orderData, token));
```

**Local State**:
```javascript
const [orderForm, setOrderForm] = useState({
  name: {
    elementType: 'input',
    elementConfig: { type: 'text', placeholder: 'Your Name' },
    value: '',
    validation: { required: true },
    valid: false,
    touched: false
  },
  street: {
    elementType: 'input',
    elementConfig: { type: 'text', placeholder: 'Street' },
    value: '',
    validation: { required: true },
    valid: false,
    touched: false
  },
  zipCode: {
    elementType: 'input',
    elementConfig: { type: 'text', placeholder: 'ZIP Code' },
    value: '',
    validation: { required: true, minLength: 5, maxLength: 5 },
    valid: false,
    touched: false
  },
  country: {
    elementType: 'input',
    elementConfig: { type: 'text', placeholder: 'Country' },
    value: '',
    validation: { required: true },
    valid: false,
    touched: false
  },
  email: {
    elementType: 'input',
    elementConfig: { type: 'email', placeholder: 'Your E-Mail' },
    value: '',
    validation: { required: true, isEmail: true },
    valid: false,
    touched: false
  },
  deliveryMethod: {
    elementType: 'select',
    elementConfig: {
      options: [
        { value: 'fastest', displayValue: 'Fastest' },
        { value: 'cheapest', displayValue: 'Cheapest' }
      ]
    },
    value: 'fastest',
    validation: {},
    valid: true
  }
});
const [formIsValid, setFormIsValid] = useState(false);
```

**Key Features**:
- Dynamic form generation from config object
- Real-time validation (required, min/max length, email)
- Visual feedback for invalid fields
- Disables submit button if form invalid
- Displays loading spinner during order submission
- Attaches userId to order

**Child Components**:
- `<Input>` - Dynamic form inputs (x6)
- `<Button>` - Order button
- `<Spinner>` - Loading indicator

---

### Orders

**Location**: `/src/containers/Orders/Orders.js`

**Purpose**: Display user's order history

**Redux State**:
```javascript
const orders = useSelector(state => state.order.orders);
const loading = useSelector(state => state.order.loading);
const token = useSelector(state => state.auth.token);
const userId = useSelector(state => state.auth.userId);
const fetched = useSelector(state => state.order.fetched);
```

**Redux Actions**:
```javascript
const onFetchOrders = (token, userId) => dispatch(actions.fetchOrders(token, userId));
```

**Key Features**:
- Fetches orders on component mount (only if not already fetched)
- Displays list of past orders
- Shows loading spinner while fetching
- Shows each order with ingredients and price

**Child Components**:
- `<Order>` - Individual order display (xN)
- `<Spinner>` - Loading indicator

---

### Logout

**Location**: `/src/containers/Auth/Logout/Logout.js`

**Purpose**: Handle user logout

**Redux Actions**:
```javascript
const onLogout = () => dispatch(actions.logout());
```

**Key Features**:
- Dispatches logout action on mount
- Redirects to home page
- Clears auth token from localStorage

**Usage**:
```javascript
// Accessed via route
<Route path="/logout" exact component={Logout} />
```

---

## Presentational Components

Presentational components are located in `/src/components/` and receive data only via props.

### Burger Components

#### Burger

**Location**: `/src/components/Burger/Burger.js`

**Props**:
```javascript
{
  ingredients: {
    salad: number,
    bacon: number,
    cheese: number,
    meat: number
  }
}
```

**Purpose**: Visual representation of the burger

**Features**:
- Transforms ingredients object into array of components
- Displays BurgerIngredient for each ingredient
- Shows "Please start adding ingredients" if empty
- Wraps ingredients with top and bottom buns

**Example**:
```javascript
<Burger ingredients={{ salad: 1, bacon: 2, cheese: 1, meat: 1 }} />
```

**Renders**:
```jsx
<div>
  <BurgerIngredient type="bread-top" />
  <BurgerIngredient type="salad" />
  <BurgerIngredient type="bacon" />
  <BurgerIngredient type="bacon" />
  <BurgerIngredient type="cheese" />
  <BurgerIngredient type="meat" />
  <BurgerIngredient type="bread-bottom" />
</div>
```

---

#### BurgerIngredient

**Location**: `/src/components/Burger/BurgerIngredient/BurgerIngredient.js`

**Props**:
```javascript
{
  type: 'bread-top' | 'bread-bottom' | 'meat' | 'cheese' | 'bacon' | 'salad'
}
```

**Purpose**: Render individual ingredient layer

**Features**:
- Returns specific JSX based on ingredient type
- Uses CSS Modules for styling
- PropTypes validation

**Example**:
```javascript
<BurgerIngredient type="bacon" />
```

**Ingredient Types**:
- `bread-top` - Top bun with seeds
- `bread-bottom` - Bottom bun
- `meat` - Meat patty
- `cheese` - Cheese slice
- `bacon` - Bacon strip
- `salad` - Lettuce

---

#### BuildControls

**Location**: `/src/components/Burger/BuildControls/BuildControls.js`

**Props**:
```javascript
{
  ingredientAdded: (type) => void,
  ingredientRemoved: (type) => void,
  disabled: { salad: boolean, bacon: boolean, cheese: boolean, meat: boolean },
  purchasable: boolean,
  ordered: () => void,
  isAuth: boolean,
  price: number
}
```

**Purpose**: Controls for adding/removing ingredients

**Features**:
- Displays current price
- Renders BuildControl for each ingredient type
- Disables "Less" button when ingredient count is 0
- Shows "ORDER NOW" or "SIGN UP TO ORDER" button
- Enables order button only when purchasable

**Example**:
```javascript
<BuildControls
  ingredientAdded={onIngredientAdded}
  ingredientRemoved={onIngredientRemoved}
  disabled={{ salad: false, bacon: true, cheese: false, meat: false }}
  purchasable={true}
  ordered={purchaseHandler}
  isAuth={true}
  price={7.2}
/>
```

---

#### BuildControl

**Location**: `/src/components/Burger/BuildControls/BuildControl/BuildControl.js`

**Props**:
```javascript
{
  label: string,
  added: () => void,
  removed: () => void,
  disabled: boolean
}
```

**Purpose**: Single ingredient control (More/Less buttons)

**Example**:
```javascript
<BuildControl
  label="Bacon"
  added={() => onIngredientAdded('bacon')}
  removed={() => onIngredientRemoved('bacon')}
  disabled={false}
/>
```

---

#### OrderSummary

**Location**: `/src/components/Burger/OrderSummary/OrderSummary.js`

**Props**:
```javascript
{
  ingredients: { salad: number, bacon: number, cheese: number, meat: number },
  price: number,
  purchaseCancelled: () => void,
  purchaseContinued: () => void
}
```

**Purpose**: Summary of order before checkout

**Features**:
- Lists ingredients with quantities
- Shows total price
- Cancel and Continue buttons

**Example**:
```javascript
<OrderSummary
  ingredients={{ salad: 1, bacon: 2, cheese: 1, meat: 1 }}
  price={7.2}
  purchaseCancelled={purchaseCancelHandler}
  purchaseContinued={purchaseContinueHandler}
/>
```

---

### Navigation Components

#### Toolbar

**Location**: `/src/components/Navigation/Toolbar/Toolbar.js`

**Props**:
```javascript
{
  isAuth: boolean,
  drawerToggleClicked: () => void
}
```

**Purpose**: Top navigation bar

**Features**:
- Logo
- Navigation items (desktop only)
- Drawer toggle button (mobile only)

**Example**:
```javascript
<Toolbar isAuth={true} drawerToggleClicked={sideDrawerToggleHandler} />
```

---

#### SideDrawer

**Location**: `/src/components/Navigation/SideDrawer/SideDrawer.js`

**Props**:
```javascript
{
  isAuth: boolean,
  open: boolean,
  closed: () => void
}
```

**Purpose**: Mobile navigation drawer

**Features**:
- Logo
- Navigation items
- Backdrop overlay
- Slide-in animation

**Example**:
```javascript
<SideDrawer
  isAuth={true}
  open={showSideDrawer}
  closed={sideDrawerClosedHandler}
/>
```

---

#### NavigationItems

**Location**: `/src/components/Navigation/NavigationItems/NavigationItems.js`

**Props**:
```javascript
{
  isAuthenticated: boolean
}
```

**Purpose**: List of navigation links

**Features**:
- Conditional rendering based on auth status
- NavLink components with active styling

**Links**:
- Burger Builder (always)
- Orders (authenticated only)
- Authenticate (unauthenticated only)
- Logout (authenticated only)

**Example**:
```javascript
<NavigationItems isAuthenticated={true} />
```

---

#### NavigationItem

**Location**: `/src/components/Navigation/NavigationItems/NavigationItem/NavigationItem.js`

**Props**:
```javascript
{
  link: string,
  exact?: boolean,
  children: React.ReactNode
}
```

**Purpose**: Single navigation link

**Example**:
```javascript
<NavigationItem link="/orders" exact>
  Orders
</NavigationItem>
```

---

### Order Components

#### Order

**Location**: `/src/components/Order/Order.js`

**Props**:
```javascript
{
  ingredients: { salad: number, bacon: number, cheese: number, meat: number },
  price: number
}
```

**Purpose**: Display single order in order history

**Features**:
- Shows ingredient list with quantities
- Displays price
- Styled as a card

**Example**:
```javascript
<Order
  ingredients={{ salad: 1, bacon: 2, cheese: 1, meat: 1 }}
  price={7.2}
/>
```

---

#### CheckoutSummary

**Location**: `/src/components/Order/CheckoutSummary/CheckoutSummary.js`

**Props**:
```javascript
{
  ingredients: { salad: number, bacon: number, cheese: number, meat: number },
  checkoutCancelled: () => void,
  checkoutContinued: () => void
}
```

**Purpose**: Summary display during checkout

**Features**:
- Large burger visualization
- Cancel and Continue buttons

**Example**:
```javascript
<CheckoutSummary
  ingredients={{ salad: 1, bacon: 2, cheese: 1, meat: 1 }}
  checkoutCancelled={checkoutCancelledHandler}
  checkoutContinued={checkoutContinuedHandler}
/>
```

---

### UI Components

#### Modal

**Location**: `/src/components/UI/Modal/Modal.js`

**Props**:
```javascript
{
  show: boolean,
  modalClosed: () => void,
  children: React.ReactNode
}
```

**Purpose**: Reusable modal dialog

**Features**:
- Backdrop overlay
- Slide-down animation
- Click outside to close
- React.memo optimization with custom comparison

**Example**:
```javascript
<Modal show={purchasing} modalClosed={purchaseCancelHandler}>
  <OrderSummary {...props} />
</Modal>
```

**Optimization**:
```javascript
export default React.memo(
  Modal,
  (prevProps, nextProps) =>
    nextProps.show === prevProps.show &&
    nextProps.children === prevProps.children
);
```

---

#### Button

**Location**: `/src/components/UI/Button/Button.js`

**Props**:
```javascript
{
  btnType: 'Success' | 'Danger',
  clicked?: () => void,
  disabled?: boolean,
  children: React.ReactNode
}
```

**Purpose**: Styled button component

**Example**:
```javascript
<Button btnType="Success" clicked={orderHandler}>
  ORDER
</Button>
```

---

#### Input

**Location**: `/src/components/UI/Input/Input.js`

**Props**:
```javascript
{
  elementType: 'input' | 'textarea' | 'select',
  elementConfig: {
    type?: string,
    placeholder?: string,
    options?: Array<{ value: string, displayValue: string }>
  },
  value: string,
  invalid: boolean,
  shouldValidate: boolean,
  touched: boolean,
  changed: (event) => void,
  label?: string
}
```

**Purpose**: Dynamic form input component

**Features**:
- Supports input, textarea, select
- Validation visual feedback
- Label support

**Example**:
```javascript
<Input
  elementType="input"
  elementConfig={{ type: 'email', placeholder: 'Your Email' }}
  value={email}
  invalid={!emailValid}
  shouldValidate={true}
  touched={emailTouched}
  changed={(event) => inputChangedHandler(event, 'email')}
/>
```

---

#### Spinner

**Location**: `/src/components/UI/Spinner/Spinner.js`

**Props**: None

**Purpose**: Loading indicator

**Example**:
```javascript
{loading ? <Spinner /> : <OrdersList />}
```

---

#### Backdrop

**Location**: `/src/components/UI/Backdrop/Backdrop.js`

**Props**:
```javascript
{
  show: boolean,
  clicked: () => void
}
```

**Purpose**: Semi-transparent overlay

**Example**:
```javascript
<Backdrop show={showModal} clicked={closeModal} />
```

---

## Higher-Order Components

### Layout

**Location**: `/src/hoc/Layout/Layout.js`

**Purpose**: Provides app structure with navigation

**Features**:
- Toolbar (desktop)
- SideDrawer (mobile)
- Main content area
- Manages side drawer open/close state

**Usage**:
```javascript
<Layout>
  <BurgerBuilder />
</Layout>
```

---

### withErrorHandler

**Location**: `/src/components/UI/withErrorHandler/withErrorHandler.js`

**Purpose**: Adds HTTP error handling to components

**Features**:
- Wraps component with error modal
- Uses custom hook for error interception
- Displays error messages

**Usage**:
```javascript
export default withErrorHandler(BurgerBuilder, axios);
```

**Implementation**:
```javascript
const withErrorHandler = (WrappedComponent, axios) => {
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

---

### Auxiliary

**Location**: `/src/hoc/Auxiliary/Auxiliary.js`

**Purpose**: Fragment wrapper for returning multiple elements

**Usage**:
```javascript
<Aux>
  <div>First</div>
  <div>Second</div>
</Aux>
```

**Implementation**:
```javascript
const aux = props => props.children;
export default aux;
```

---

## Custom Hooks

### useHttpErrorHandler

**Location**: `/src/hooks/http-error-handler.js`

**Purpose**: Axios error handling with interceptors

**Parameters**:
```javascript
{
  httpClient: AxiosInstance
}
```

**Returns**:
```javascript
[error: Error | null, clearError: () => void]
```

**Features**:
- Sets up request/response interceptors
- Clears errors on new requests
- Captures response errors
- Cleanup on unmount

**Usage**:
```javascript
const [error, clearError] = useHttpErrorHandler(axios);

return (
  <Modal show={error} modalClosed={clearError}>
    {error ? error.message : null}
  </Modal>
);
```

**Implementation**:
```javascript
export default httpClient => {
  const [error, setError] = useState(null);

  const reqInterceptor = useRef();
  const resInterceptor = useRef();

  useEffect(() => {
    reqInterceptor.current = httpClient.interceptors.request.use(req => {
      setError(null);
      return req;
    });
    resInterceptor.current = httpClient.interceptors.response.use(
      res => res,
      err => {
        setError(err);
        return Promise.reject(err);
      }
    );

    return () => {
      httpClient.interceptors.request.eject(reqInterceptor.current);
      httpClient.interceptors.response.eject(resInterceptor.current);
    };
  }, [httpClient]);

  const errorConfirmedHandler = () => {
    setError(null);
  };

  return [error, errorConfirmedHandler];
};
```

---

## Component Patterns

### 1. Dynamic Form Pattern

Generate forms from configuration objects:

```javascript
const formElementsArray = [];
for (let key in orderForm) {
  formElementsArray.push({
    id: key,
    config: orderForm[key]
  });
}

const form = formElementsArray.map(formElement => (
  <Input
    key={formElement.id}
    elementType={formElement.config.elementType}
    elementConfig={formElement.config.elementConfig}
    value={formElement.config.value}
    invalid={!formElement.config.valid}
    shouldValidate={formElement.config.validation}
    touched={formElement.config.touched}
    changed={(event) => inputChangedHandler(event, formElement.id)}
  />
));
```

### 2. Conditional Rendering Pattern

```javascript
{isAuthenticated && (
  <NavigationItem link="/orders">Orders</NavigationItem>
)}
{!isAuthenticated && (
  <NavigationItem link="/auth">Authenticate</NavigationItem>
)}
```

### 3. Loading State Pattern

```javascript
let content = <Spinner />;
if (!loading) {
  content = orders.map(order => <Order key={order.id} {...order} />);
}
return <div>{content}</div>;
```

### 4. Error Boundary Pattern

```javascript
{error && <p>Something went wrong!</p>}
{!error && <Component />}
```

---

**Last Updated**: 2025-11-04
