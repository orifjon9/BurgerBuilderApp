# CLAUDE.md - AI Assistant Context File

## Project Overview

**BurgerBuilderApp** is a full-stack React single-page application (SPA) that allows users to build custom burgers, authenticate, place orders, and view order history.

## Quick Facts

- **Type**: React SPA (Create React App)
- **Version**: 0.1.0
- **Main Language**: JavaScript (ES6+)
- **Framework**: React 16.8.6
- **State Management**: Redux 4.0.5 + Redux-Saga 1.1.3
- **Backend**: Firebase Realtime Database + Firebase Identity Toolkit
- **Styling**: CSS Modules
- **Build Tool**: Webpack 4

## Project Structure

```
src/
├── components/        # Presentational components (UI only)
├── containers/        # Smart components (connected to Redux)
├── hoc/              # Higher-Order Components
├── hooks/            # Custom React hooks
├── store/            # Redux (actions, reducers, sagas)
├── shared/           # Utility functions
└── assets/           # Images and static resources
```

## Key Technologies

1. **React Hooks** - All containers use functional components with hooks
2. **Redux-Saga** - Primary middleware for async operations (not Redux-Thunk)
3. **React Router v5** - Client-side routing with code splitting
4. **Axios** - HTTP client with custom interceptors
5. **CSS Modules** - Component-scoped styling

## Architecture Patterns

### Component Types
- **Presentational**: UI-only components in `/components` (Burger, Button, Modal, etc.)
- **Container**: Smart components in `/containers` (BurgerBuilder, Auth, Checkout, Orders)
- **HOC**: Reusable wrappers in `/hoc` (Layout, withErrorHandler)

### State Management
- **Redux Store**: 3 main slices (burgerBuilder, order, auth)
- **Redux-Saga**: Generator functions for all async operations
- **Custom Middleware**: Logger middleware in development mode

### Routing Strategy
- Public routes: `/` (BurgerBuilder)
- Auth-only routes: `/checkout`, `/orders`, `/logout`
- Unauthenticated-only: `/auth`
- Code splitting: Auth, Checkout, Orders lazy-loaded

## Core Features

1. **Burger Builder** (`/src/containers/BurgerBuilder/`)
   - Add/remove ingredients dynamically
   - Real-time price calculation
   - Visual burger representation

2. **Authentication** (`/src/containers/Auth/`, `/src/store/sagas/auth.js`)
   - Sign up / Sign in with Firebase
   - Token persistence in localStorage
   - Automatic logout on token expiration
   - Session restoration on app load

3. **Order Management** (`/src/containers/Orders/`, `/src/store/sagas/order.js`)
   - Submit orders with delivery information
   - View order history (user-specific)
   - Form validation

## Important Files

### Entry Points
- `/src/index.js` - App entry, Redux store setup
- `/src/App.js` - Root component with routing

### State Management
- `/src/store/actions/actionTypes.js` - All action type constants
- `/src/store/sagas/index.js` - Root saga with all watchers
- `/src/store/reducers/` - Pure state reducers

### Configuration
- `/src/axios-orders.js` - Axios instance with base URL
- `/config/webpack.config.js` - Webpack configuration
- `/package.json` - Dependencies and scripts

## Redux State Shape

```javascript
{
  burgerBuilder: {
    ingredients: { salad, bacon, cheese, meat },
    totalPrice: number,
    error: boolean,
    building: boolean
  },
  order: {
    orders: [],
    loading: boolean,
    purchased: boolean,
    fetched: boolean
  },
  auth: {
    token: string | null,
    userId: string | null,
    email: string | null,
    error: string | null,
    loading: boolean
  }
}
```

## API Integration

**Firebase Base URL**: `https://react-burger-app-cdd66.firebaseio.com/`

### Endpoints
- `GET /ingredients.json` - Fetch available ingredients
- `POST /orders.json?auth={token}` - Create order
- `GET /orders.json?auth={token}&orderBy="userId"&equalTo="{userId}"` - Fetch user orders
- Firebase Auth API - Sign up, Sign in

## Common Utilities

- `/src/shared/utility.js`:
  - `updateObject(oldObject, updatedProperties)` - Immutable object update
  - `checkValidity(value, rules)` - Form validation

- `/src/hooks/http-error-handler.js`:
  - Custom hook for Axios error handling with interceptors

## Development Commands

```bash
npm start        # Development server (localhost:3000)
npm run build    # Production build
npm test         # Run tests
```

## Code Style & Conventions

- **Components**: PascalCase (e.g., `BurgerBuilder.js`)
- **CSS Modules**: Import as `classes` (e.g., `classes.BurgerBuilder`)
- **Action Types**: SCREAMING_SNAKE_CASE (e.g., `AUTH_SUCCESS`)
- **Saga Functions**: camelCase + "Saga" suffix (e.g., `authUserSaga`)
- **Action Creators**: camelCase (e.g., `initIngredients()`)

## Testing

- **Framework**: Jest + Enzyme
- **Adapter**: enzyme-adapter-react-16
- **Test Files**: `*.test.js` alongside source files
- **Coverage**: Limited (3 test files currently)

## Important Notes for AI Assistants

1. **Use Redux-Saga, not Redux-Thunk** - Primary async pattern is sagas
2. **Functional Components** - No class components, use hooks
3. **CSS Modules** - Always import styles as `classes` object
4. **Immutability** - Use `updateObject()` utility for state updates
5. **Error Handling** - Use `withErrorHandler` HOC for components making HTTP requests
6. **Route Protection** - Check `isAuthenticated` state for conditional routing
7. **Form Validation** - Use configuration object pattern with validation rules
8. **Token Management** - Handled automatically by auth saga

## Recent Changes (Git History)

- Converted class components to functional components
- Added `useSelector()` and `useDispatch()` throughout
- Implemented custom `http-error-handler` hook
- Added React.memo optimizations
- Fixed useEffect() dependency arrays

## Common Tasks

### Adding a New Feature
1. Create action types in `/src/store/actions/actionTypes.js`
2. Create action creators in `/src/store/actions/`
3. Add saga for async operations in `/src/store/sagas/`
4. Create/update reducer in `/src/store/reducers/`
5. Create/update container component
6. Update routing in `/src/App.js` if needed

### Debugging
- Redux DevTools available in development
- Logger middleware logs all actions/state
- Check browser console for React warnings
- Check Network tab for API calls

## External Resources

- Firebase Realtime Database: Used for orders and ingredients
- Firebase Authentication: Email/password authentication
- No other third-party APIs

## Known Limitations

- No TypeScript (though ESLint TypeScript plugin included)
- Limited test coverage
- Service Worker disabled (PWA not active)
- No offline support
- No internationalization (i18n)
- Fixed ingredient types (salad, bacon, cheese, meat)

## Contact & Documentation

- See `/docs` folder for detailed documentation
- Check `README.md` for project overview
- Review `package.json` for dependencies

---

**Last Updated**: 2025-11-04
**Maintained for**: Claude AI Assistant Context
