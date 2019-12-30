import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Logout from './containers/Auth/Logout/Logout';
import * as actions from './store/actions/index';
import asyncComponent from './hoc/asyncComponent/asyncComponent';

class App extends React.Component {

  componentDidMount() {
    if (!this.props.isAuthenticated) {
      this.props.onAuthCheckStatus();
    }
  }

  routes = [
    { path: "/checkout", component: asyncComponent(() => import('./containers/Checkout/Checkout')), condition: () => this.props.isAuthenticated },
    { path: "/orders", component: asyncComponent(() => import('./containers/Orders/Orders')), condition: () => this.props.isAuthenticated },
    { path: "/auth", component: asyncComponent(() => import('./containers/Auth/Auth')), condition: () => !this.props.isAuthenticated },
    { path: "/logout", component: Logout, condition: () => this.props.isAuthenticated },
    { path: "/", component: BurgerBuilder, condition: () => true }
  ];

  render() {
    return (
      <div>
        <Layout>
          <Switch>
            {
              this.routes.filter(f => f.condition()).map(route => <Route path={route.path} component={route.component} />)
            }
          </Switch>
        </Layout>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAuthCheckStatus: () => dispatch(actions.checkAuthStatusAsync())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
