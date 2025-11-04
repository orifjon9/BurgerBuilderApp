# BurgerBuilderApp Documentation

Welcome to the BurgerBuilderApp documentation! This comprehensive guide will help you understand, set up, and develop the application.

## Table of Contents

### Quick Start
- [SETUP.md](SETUP.md) - Installation and configuration guide
- [CLAUDE.md](CLAUDE.md) - Quick reference for AI assistants

### Architecture & Design
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture and design patterns
- [STATE_MANAGEMENT.md](STATE_MANAGEMENT.md) - Redux and Redux-Saga implementation
- [COMPONENTS.md](COMPONENTS.md) - Component catalog and usage

### Features & Integration
- [AUTHENTICATION.md](AUTHENTICATION.md) - Authentication flow and security
- [API.md](API.md) - Firebase API integration and endpoints

### Development
- [DEVELOPMENT.md](DEVELOPMENT.md) - Development guidelines and workflows

---

## Documentation Overview

### 📋 [CLAUDE.md](CLAUDE.md)
**AI Assistant Context File**

Quick reference guide for AI assistants working with the codebase.

**Contents**:
- Project overview and tech stack
- Key file locations
- Redux state shape
- Common patterns
- Important notes for AI development

**Best for**: Quick onboarding, AI-assisted development

---

### 🏗️ [ARCHITECTURE.md](ARCHITECTURE.md)
**System Architecture Documentation**

Deep dive into the application's architectural design and patterns.

**Contents**:
- System architecture diagram
- Project structure breakdown
- Component architecture (Container/Presentational pattern)
- State management architecture
- Routing strategy
- Data flow diagrams
- Performance optimizations
- Error handling patterns

**Best for**: Understanding overall system design, architectural decisions

---

### 🔄 [STATE_MANAGEMENT.md](STATE_MANAGEMENT.md)
**Redux & Redux-Saga Guide**

Comprehensive guide to state management implementation.

**Contents**:
- Redux store setup
- Complete state structure
- Action types and creators
- Reducer implementations
- Redux-Saga patterns
- Connecting components
- Best practices

**Best for**: Working with Redux, adding new features, state debugging

---

### 🔌 [API.md](API.md)
**API Integration Documentation**

Firebase integration and API endpoint reference.

**Contents**:
- Firebase setup instructions
- Axios configuration
- API endpoint specifications
- Authentication API (Firebase Identity Toolkit)
- Request/response examples
- Error handling
- Security considerations

**Best for**: API integration, backend setup, troubleshooting API issues

---

### 🧩 [COMPONENTS.md](COMPONENTS.md)
**Component Catalog**

Complete reference of all React components in the application.

**Contents**:
- Container components (BurgerBuilder, Auth, Checkout, Orders)
- Presentational components (Burger, Modal, Button, Input, etc.)
- Higher-Order Components (Layout, withErrorHandler)
- Custom hooks (useHttpErrorHandler)
- Component patterns
- Props specifications

**Best for**: Understanding components, component API reference, UI development

---

### 🔐 [AUTHENTICATION.md](AUTHENTICATION.md)
**Authentication Flow & Security**

Detailed authentication implementation and security practices.

**Contents**:
- Complete authentication flow diagrams
- Sign up process
- Sign in process
- Token management (storage, expiration, validation)
- Session persistence
- Logout process
- Route protection
- Security considerations and improvements

**Best for**: Understanding auth flow, implementing security features, debugging auth issues

---

### 🚀 [SETUP.md](SETUP.md)
**Installation & Configuration Guide**

Step-by-step guide to get the application running.

**Contents**:
- Prerequisites
- Installation steps
- Firebase project setup
- Configuration (database, authentication)
- Running development server
- Building for production
- Deployment options
- Troubleshooting common issues

**Best for**: First-time setup, deployment, solving setup problems

---

### 💻 [DEVELOPMENT.md](DEVELOPMENT.md)
**Development Guidelines**

Best practices and workflows for developing the application.

**Contents**:
- Development environment setup
- Code style guidelines
- Component development patterns
- Adding new Redux state
- Testing guide
- Debugging techniques
- Git workflow
- Performance optimization
- Common development tasks

**Best for**: Day-to-day development, code quality, team collaboration

---

## Quick Links

### Getting Started
1. [Install prerequisites](SETUP.md#prerequisites)
2. [Clone and install dependencies](SETUP.md#installation)
3. [Set up Firebase](SETUP.md#firebase-setup)
4. [Configure the app](SETUP.md#configuration)
5. [Run development server](SETUP.md#running-the-application)

### Understanding the Project
1. [Read project overview](CLAUDE.md#project-overview)
2. [Review architecture](ARCHITECTURE.md#system-architecture)
3. [Understand state management](STATE_MANAGEMENT.md#overview)
4. [Explore components](COMPONENTS.md#overview)

### Common Tasks
- [Adding a new feature](DEVELOPMENT.md#state-management) → Create actions, reducers, sagas
- [Creating a new component](DEVELOPMENT.md#creating-a-new-component)
- [Adding a new route](DEVELOPMENT.md#adding-a-new-route)
- [Debugging Redux state](DEVELOPMENT.md#redux-devtools)
- [Fixing auth issues](AUTHENTICATION.md#common-sign-in-errors)
- [Deploying to production](SETUP.md#building-for-production)

## Project Structure Reference

```
BurgerBuilderApp/
├── docs/                           # 📚 Documentation (you are here)
│   ├── README.md                  # This file
│   ├── CLAUDE.md                  # AI assistant context
│   ├── ARCHITECTURE.md            # System architecture
│   ├── STATE_MANAGEMENT.md        # Redux guide
│   ├── API.md                     # API reference
│   ├── COMPONENTS.md              # Component catalog
│   ├── AUTHENTICATION.md          # Auth guide
│   ├── SETUP.md                   # Setup guide
│   └── DEVELOPMENT.md             # Dev guidelines
│
├── src/                           # 💾 Application source
│   ├── components/                # Presentational components
│   ├── containers/                # Container components
│   ├── hoc/                       # Higher-Order Components
│   ├── hooks/                     # Custom hooks
│   ├── store/                     # Redux (actions, reducers, sagas)
│   ├── shared/                    # Utilities
│   └── assets/                    # Images, fonts
│
├── config/                        # ⚙️ Build configuration
├── scripts/                       # 📜 Build scripts
├── public/                        # 🌐 Static assets
└── package.json                   # 📦 Dependencies

```

## Technology Stack

| Category | Technology | Version | Documentation |
|----------|------------|---------|---------------|
| **UI Framework** | React | 16.8.6 | [Components](COMPONENTS.md) |
| **State Management** | Redux | 4.0.5 | [State Management](STATE_MANAGEMENT.md) |
| **Side Effects** | Redux-Saga | 1.1.3 | [State Management](STATE_MANAGEMENT.md) |
| **Routing** | React Router | 5.1.2 | [Architecture](ARCHITECTURE.md#routing-architecture) |
| **HTTP Client** | Axios | 0.19.0 | [API](API.md#axios-configuration) |
| **Backend** | Firebase | - | [API](API.md#firebase-setup) |
| **Authentication** | Firebase Auth | - | [Authentication](AUTHENTICATION.md) |
| **Build Tool** | Webpack | 4.29.6 | [Setup](SETUP.md) |
| **Testing** | Jest + Enzyme | - | [Development](DEVELOPMENT.md#testing) |

## Key Features

### 🍔 Burger Builder
Build custom burgers with dynamic ingredient selection and real-time pricing.

**Documentation**: [BurgerBuilder Component](COMPONENTS.md#burgerbuilder)

### 🔐 Authentication
Email/password authentication with token management and session persistence.

**Documentation**: [Authentication Guide](AUTHENTICATION.md)

### 🛒 Order Management
Submit orders with delivery information and view order history.

**Documentation**: [Orders Component](COMPONENTS.md#orders), [Checkout Component](COMPONENTS.md#checkout)

### 🎨 Responsive UI
Mobile-friendly interface with sidebar navigation and animations.

**Documentation**: [Navigation Components](COMPONENTS.md#navigation-components)

## Development Workflow

### 1. Understanding Phase
```
Read CLAUDE.md → ARCHITECTURE.md → STATE_MANAGEMENT.md
```

### 2. Setup Phase
```
Follow SETUP.md → Configure Firebase → Run npm start
```

### 3. Development Phase
```
Follow DEVELOPMENT.md → Create feature branch → Develop → Test → PR
```

### 4. Deployment Phase
```
Build production → Deploy to hosting → Configure environment
```

## Debugging Checklist

### App Won't Start
- [ ] Check [Setup Guide - Troubleshooting](SETUP.md#troubleshooting)
- [ ] Verify Node.js version
- [ ] Clear node_modules and reinstall
- [ ] Check for port conflicts

### Firebase Issues
- [ ] Verify [API configuration](API.md#axios-configuration)
- [ ] Check Firebase security rules
- [ ] Validate API key
- [ ] Inspect Network tab for errors

### Authentication Not Working
- [ ] Review [Authentication Flow](AUTHENTICATION.md#authentication-flow)
- [ ] Check token in localStorage
- [ ] Verify Firebase Auth is enabled
- [ ] Check for error messages in Redux state

### Redux State Issues
- [ ] Open Redux DevTools
- [ ] Check action dispatch in console
- [ ] Verify reducer logic
- [ ] Review [State Management Guide](STATE_MANAGEMENT.md)

### Component Not Rendering
- [ ] Check React DevTools
- [ ] Verify props being passed
- [ ] Check conditional rendering logic
- [ ] Review [Components Guide](COMPONENTS.md)

## Contributing

When contributing to the project:

1. **Read Documentation**: Familiarize yourself with architecture and patterns
2. **Follow Style Guide**: See [Development Guide](DEVELOPMENT.md#code-style-guidelines)
3. **Write Tests**: Add tests for new features
4. **Update Docs**: Keep documentation in sync with code changes
5. **Use Git Workflow**: Follow [Git Workflow](DEVELOPMENT.md#git-workflow)

## Additional Resources

### External Documentation
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Redux Documentation](https://redux.js.org/)
- [Redux-Saga Documentation](https://redux-saga.js.org/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Router Documentation](https://reactrouter.com/)

### Tools
- [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools/)
- [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/)
- [VS Code](https://code.visualstudio.com/)

### Community
- [React Community](https://reactjs.org/community/support.html)
- [Redux Community](https://redux.js.org/introduction/getting-started#help-and-discussion)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/reactjs)

## Documentation Maintenance

This documentation is maintained alongside the codebase. When making changes:

### When to Update Documentation

| Code Change | Update Documentation |
|-------------|---------------------|
| New component | Add to [COMPONENTS.md](COMPONENTS.md) |
| New Redux state | Update [STATE_MANAGEMENT.md](STATE_MANAGEMENT.md) |
| New API endpoint | Add to [API.md](API.md) |
| Architecture change | Update [ARCHITECTURE.md](ARCHITECTURE.md) |
| New auth flow | Update [AUTHENTICATION.md](AUTHENTICATION.md) |
| Setup change | Update [SETUP.md](SETUP.md) |
| New dev pattern | Add to [DEVELOPMENT.md](DEVELOPMENT.md) |

### Documentation Style

- Use clear, concise language
- Include code examples
- Add diagrams for complex flows
- Link between related documentation
- Keep table of contents updated

---

## Need Help?

**Can't find what you're looking for?**

1. Check the relevant documentation file
2. Use browser search (Ctrl/Cmd + F) to find specific terms
3. Review the [Quick Links](#quick-links) section
4. Check the [Debugging Checklist](#debugging-checklist)
5. Search GitHub issues
6. Ask on Stack Overflow with relevant tags

**Found an issue in the docs?**

Please open an issue or submit a pull request with corrections!

---

**Documentation Last Updated**: 2025-11-04

**Project Version**: 0.1.0

**Maintained by**: BurgerBuilderApp Team
