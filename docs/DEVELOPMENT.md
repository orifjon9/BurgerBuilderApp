# Development Guide

## Table of Contents

1. [Development Environment](#development-environment)
2. [Project Structure](#project-structure)
3. [Code Style Guidelines](#code-style-guidelines)
4. [Component Development](#component-development)
5. [State Management](#state-management)
6. [Testing](#testing)
7. [Debugging](#debugging)
8. [Git Workflow](#git-workflow)
9. [Performance Optimization](#performance-optimization)
10. [Common Tasks](#common-tasks)

## Development Environment

### Recommended IDE Setup

#### Visual Studio Code

**Recommended Extensions**:
- ESLint
- Prettier - Code formatter
- ES7 React/Redux/GraphQL snippets
- Auto Rename Tag
- Path Intellisense
- GitLens
- Redux DevTools
- CSS Modules

**Settings** (`.vscode/settings.json`):
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "javascript.updateImportsOnFileMove.enabled": "always",
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  }
}
```

#### WebStorm

**Configuration**:
- Enable ESLint: Preferences → Languages → JavaScript → Code Quality Tools → ESLint
- Enable React syntax: Preferences → Languages → JavaScript → React
- Set JSX to JavaScript (React)

### Browser Tools

**Required Extensions**:
- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/)
- [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/)

**Chrome DevTools Shortcuts**:
- `F12` - Open DevTools
- `Cmd/Ctrl + Shift + C` - Element inspector
- `Cmd/Ctrl + Shift + J` - Console
- `Cmd/Ctrl + K` - Clear console

## Project Structure

### Directory Organization

```
src/
├── components/          # Presentational components
│   ├── Burger/         # Feature-specific components
│   ├── Navigation/     # Navigation components
│   ├── Order/          # Order-related components
│   └── UI/             # Reusable UI components
│
├── containers/          # Smart components (Redux-connected)
│   ├── BurgerBuilder/
│   ├── Checkout/
│   ├── Orders/
│   └── Auth/
│
├── hoc/                # Higher-Order Components
│   ├── Layout/
│   ├── Auxiliary/
│   └── asyncComponent/
│
├── hooks/              # Custom React hooks
│
├── store/              # Redux state management
│   ├── actions/
│   ├── reducers/
│   └── sagas/
│
├── shared/             # Utility functions
│
└── assets/             # Static files (images, fonts)
```

### File Naming Conventions

| File Type | Convention | Example |
|-----------|------------|---------|
| React Components | PascalCase | `BurgerBuilder.js` |
| CSS Modules | PascalCase | `BurgerBuilder.module.css` |
| Utility Functions | camelCase | `updateObject.js` |
| Constants | SCREAMING_SNAKE_CASE | `actionTypes.js` |
| Hooks | camelCase with `use` prefix | `useHttpErrorHandler.js` |
| Test Files | Same as source + `.test` | `BurgerBuilder.test.js` |

## Code Style Guidelines

### JavaScript/React Style

#### Import Organization

```javascript
// 1. React imports
import React, { useState, useEffect } from 'react';

// 2. Third-party libraries
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

// 3. Internal imports (absolute paths)
import * as actions from '../../store/actions/index';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';

// 4. CSS imports (last)
import classes from './BurgerBuilder.module.css';
```

#### Component Structure

**Functional Component Template**:
```javascript
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import * as actions from '../../store/actions/index';
import classes from './ComponentName.module.css';

const ComponentName = props => {
  // 1. Redux state
  const stateValue = useSelector(state => state.slice.value);

  // 2. Redux dispatch
  const dispatch = useDispatch();

  // 3. Local state
  const [localState, setLocalState] = useState(null);

  // 4. Side effects
  useEffect(() => {
    // Effect logic
  }, [dependency]);

  // 5. Event handlers
  const clickHandler = () => {
    // Handler logic
  };

  // 6. Render variables
  let content = null;

  // 7. Conditional render logic
  if (stateValue) {
    content = <div>...</div>;
  }

  // 8. JSX return
  return (
    <div className={classes.ComponentName}>
      {content}
    </div>
  );
};

export default ComponentName;
```

#### Naming Conventions

```javascript
// ✅ GOOD
const BurgerBuilder = props => { ... };
const onIngredientAdded = (name) => { ... };
const purchaseHandler = () => { ... };

// ❌ BAD
const burgerBuilder = props => { ... };  // Component should be PascalCase
const addIngredient = (name) => { ... };  // Handler missing "Handler" suffix
const purchase = () => { ... };  // Handler missing "Handler" suffix
```

#### PropTypes (Optional)

```javascript
import PropTypes from 'prop-types';

ComponentName.propTypes = {
  ingredients: PropTypes.object.isRequired,
  price: PropTypes.number.isRequired,
  onIngredientAdded: PropTypes.func
};
```

### CSS Style

#### CSS Modules Pattern

```css
/* BurgerBuilder.module.css */

.BurgerBuilder {
  /* Container styles */
}

.BuildControls {
  /* Nested component styles */
}

.Button {
  /* Local button styles */
}
```

**Usage**:
```javascript
import classes from './BurgerBuilder.module.css';

<div className={classes.BurgerBuilder}>
  <div className={classes.BuildControls}>
    <button className={classes.Button}>Click</button>
  </div>
</div>
```

#### Conditional Classes

```javascript
const buttonClasses = [classes.Button];
if (props.disabled) {
  buttonClasses.push(classes.Disabled);
}

<button className={buttonClasses.join(' ')}>
  Click
</button>
```

## Component Development

### Creating a New Component

#### 1. Presentational Component

```bash
# Create component directory
mkdir -p src/components/FeatureName/ComponentName

# Create component file
touch src/components/FeatureName/ComponentName/ComponentName.js

# Create CSS module
touch src/components/FeatureName/ComponentName/ComponentName.module.css
```

**Component Template**:
```javascript
import React from 'react';
import classes from './ComponentName.module.css';

const ComponentName = props => {
  return (
    <div className={classes.ComponentName}>
      {props.children}
    </div>
  );
};

export default ComponentName;
```

#### 2. Container Component

```bash
# Create container directory
mkdir -p src/containers/ContainerName

# Create container file
touch src/containers/ContainerName/ContainerName.js

# Create CSS module
touch src/containers/ContainerName/ContainerName.module.css
```

**Container Template**:
```javascript
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import * as actions from '../../store/actions/index';
import Component from '../../components/Component/Component';
import classes from './ContainerName.module.css';

const ContainerName = props => {
  const data = useSelector(state => state.slice.data);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.fetchData());
  }, [dispatch]);

  return (
    <div className={classes.ContainerName}>
      <Component data={data} />
    </div>
  );
};

export default ContainerName;
```

### Component Best Practices

1. **Single Responsibility**: Each component should do one thing
2. **Props Drilling**: Avoid passing props through multiple levels (use Redux)
3. **Composition**: Prefer composition over inheritance
4. **Pure Functions**: Presentational components should be pure
5. **Hooks Rules**:
   - Only call at top level
   - Only call from React functions
   - Dependencies should be complete

## State Management

### Adding New Redux State

#### 1. Define Action Types

**File**: `/src/store/actions/actionTypes.js`
```javascript
// Feature actions
export const FETCH_DATA = 'FETCH_DATA';
export const FETCH_DATA_START = 'FETCH_DATA_START';
export const FETCH_DATA_SUCCESS = 'FETCH_DATA_SUCCESS';
export const FETCH_DATA_FAIL = 'FETCH_DATA_FAIL';
```

#### 2. Create Action Creators

**File**: `/src/store/actions/feature.js`
```javascript
import * as actionTypes from './actionTypes';

// Saga action (triggers side effect)
export const fetchData = () => ({
  type: actionTypes.FETCH_DATA
});

// Reducer actions (update state)
export const fetchDataStart = () => ({
  type: actionTypes.FETCH_DATA_START
});

export const fetchDataSuccess = (data) => ({
  type: actionTypes.FETCH_DATA_SUCCESS,
  data: data
});

export const fetchDataFail = (error) => ({
  type: actionTypes.FETCH_DATA_FAIL,
  error: error
});
```

#### 3. Create Reducer

**File**: `/src/store/reducers/feature.js`
```javascript
import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
  data: null,
  loading: false,
  error: null
};

const fetchDataStart = (state, action) => {
  return updateObject(state, { loading: true });
};

const fetchDataSuccess = (state, action) => {
  return updateObject(state, {
    data: action.data,
    loading: false
  });
};

const fetchDataFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_DATA_START: return fetchDataStart(state, action);
    case actionTypes.FETCH_DATA_SUCCESS: return fetchDataSuccess(state, action);
    case actionTypes.FETCH_DATA_FAIL: return fetchDataFail(state, action);
    default: return state;
  }
};

export default reducer;
```

#### 4. Create Saga

**File**: `/src/store/sagas/feature.js`
```javascript
import { put } from 'redux-saga/effects';
import axios from '../../axios-orders';
import * as actions from '../actions/index';

export function* fetchDataSaga(action) {
  yield put(actions.fetchDataStart());
  try {
    const response = yield axios.get('/data.json');
    yield put(actions.fetchDataSuccess(response.data));
  } catch (error) {
    yield put(actions.fetchDataFail(error));
  }
}
```

#### 5. Register Saga Watcher

**File**: `/src/store/sagas/index.js`
```javascript
import { takeEvery } from 'redux-saga/effects';
import * as actionTypes from '../actions/actionTypes';
import { fetchDataSaga } from './feature';

export function* watchFeature() {
  yield takeEvery(actionTypes.FETCH_DATA, fetchDataSaga);
}

// Update root saga
// Add watchFeature to sagaMiddleware.run() in index.js
```

#### 6. Add Reducer to Store

**File**: `/src/index.js`
```javascript
import featureReducer from './store/reducers/feature';

const rootReducer = combineReducers({
  burgerBuilder: burgerBuilderReducer,
  order: orderReducer,
  auth: authReducer,
  feature: featureReducer  // Add new reducer
});
```

## Testing

### Unit Testing Components

**File**: `/src/components/Component/Component.test.js`

```javascript
import React from 'react';
import { shallow } from 'enzyme';

import Component from './Component';

describe('<Component />', () => {
  it('should render without crashing', () => {
    const wrapper = shallow(<Component />);
    expect(wrapper).toBeDefined();
  });

  it('should render with correct props', () => {
    const wrapper = shallow(<Component title="Test" />);
    expect(wrapper.find('h1').text()).toBe('Test');
  });

  it('should call handler on button click', () => {
    const mockHandler = jest.fn();
    const wrapper = shallow(<Component onClick={mockHandler} />);
    wrapper.find('button').simulate('click');
    expect(mockHandler).toHaveBeenCalledTimes(1);
  });
});
```

### Testing Reducers

**File**: `/src/store/reducers/feature.test.js`

```javascript
import reducer from './feature';
import * as actionTypes from '../actions/actionTypes';

describe('feature reducer', () => {
  it('should return initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      data: null,
      loading: false,
      error: null
    });
  });

  it('should handle FETCH_DATA_START', () => {
    expect(
      reducer({}, { type: actionTypes.FETCH_DATA_START })
    ).toEqual({
      loading: true
    });
  });

  it('should handle FETCH_DATA_SUCCESS', () => {
    expect(
      reducer({}, {
        type: actionTypes.FETCH_DATA_SUCCESS,
        data: { test: 'data' }
      })
    ).toEqual({
      data: { test: 'data' },
      loading: false
    });
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- Component.test.js

# Run with coverage
npm test -- --coverage

# Update snapshots
npm test -- -u
```

## Debugging

### React DevTools

**Component Inspector**:
1. Open React DevTools
2. Select component in tree
3. View props and state in sidebar
4. Edit props/state live

**Profiler**:
1. Open Profiler tab
2. Click "Record"
3. Interact with app
4. Stop recording
5. Analyze render times

### Redux DevTools

**State Inspector**:
- View current state tree
- Time-travel through actions
- Export/import state snapshots

**Action Inspector**:
- See all dispatched actions
- View action payloads
- Jump to any action

**Useful Features**:
- Trace: See stack trace for action
- Test: Generate test for action
- Log: Console log action/state

### Console Debugging

```javascript
// Log component render
console.log('[BurgerBuilder] render');

// Log props
console.log('[BurgerBuilder] props:', props);

// Log state updates
useEffect(() => {
  console.log('[BurgerBuilder] ingredients updated:', ingredients);
}, [ingredients]);

// Breakpoint debugging
debugger;

// Conditional logging
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data);
}
```

### Network Debugging

**Chrome DevTools → Network**:
1. Filter by XHR
2. Click request
3. View Headers, Preview, Response
4. Check status code and timing

**Common Issues**:
- 401: Authentication required
- 403: Forbidden (check Firebase rules)
- 404: Endpoint not found
- 500: Server error

## Git Workflow

### Branch Strategy

```
main (or master)
  ├── develop
  │   ├── feature/burger-customization
  │   ├── feature/payment-integration
  │   ├── bugfix/ingredient-price
  │   └── hotfix/checkout-crash
```

### Creating Feature Branch

```bash
# Update develop branch
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/new-feature

# Work on feature...
git add .
git commit -m "feat: add new feature"

# Push to remote
git push -u origin feature/new-feature
```

### Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format
<type>(<scope>): <subject>

# Types
feat:     # New feature
fix:      # Bug fix
docs:     # Documentation
style:    # Formatting, missing semicolons, etc.
refactor: # Code restructuring
test:     # Adding tests
chore:    # Maintenance

# Examples
git commit -m "feat(burger): add bacon ingredient"
git commit -m "fix(auth): resolve token expiration bug"
git commit -m "docs: update API documentation"
git commit -m "refactor(orders): extract order item component"
git commit -m "test(reducer): add auth reducer tests"
```

### Pull Request Process

1. Create feature branch
2. Make changes and commit
3. Push to remote
4. Create Pull Request on GitHub
5. Request review
6. Address feedback
7. Merge to develop

## Performance Optimization

### React Performance

#### 1. React.memo

```javascript
export default React.memo(
  Component,
  (prevProps, nextProps) => {
    // Return true if passing nextProps to render would return
    // the same result as passing prevProps to render
    return nextProps.show === prevProps.show;
  }
);
```

#### 2. useCallback

```javascript
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b]  // Only recreate if a or b changes
);
```

#### 3. useMemo

```javascript
const memoizedValue = useMemo(
  () => computeExpensiveValue(a, b),
  [a, b]  // Only recompute if a or b changes
);
```

#### 4. Code Splitting

```javascript
const LazyComponent = React.lazy(() => import('./Component'));

<Suspense fallback={<Spinner />}>
  <LazyComponent />
</Suspense>
```

### Bundle Optimization

```bash
# Analyze bundle size
npm run build
npm install -g source-map-explorer
source-map-explorer 'build/static/js/*.js'

# Check for duplicates
npm dedupe

# Update dependencies
npm update
```

## Common Tasks

### Adding a New Route

**File**: `/src/App.js`
```javascript
import NewPage from './containers/NewPage/NewPage';

// Add to routes
<Route path="/new-page" component={NewPage} />
```

### Adding a New Ingredient

**Firebase Database**:
```json
"ingredients": {
  "salad": 0,
  "bacon": 0,
  "cheese": 0,
  "meat": 0,
  "tomato": 0  // Add new ingredient
}
```

**Update Prices** (`/src/store/reducers/burgerBuilder.js`):
```javascript
const INGREDIENT_PRICES = {
  salad: 0.4,
  cheese: 0.3,
  meat: 1.4,
  bacon: 0.7,
  tomato: 0.3  // Add price
};
```

### Updating Dependencies

```bash
# Check outdated packages
npm outdated

# Update package
npm update package-name

# Update React
npm install react@latest react-dom@latest

# Update all (carefully!)
npm update
```

---

**Last Updated**: 2025-11-04
