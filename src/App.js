import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Checkout from './containers/Checkout/Checkout';
import Orders from './containers/Orders/Orders';
import Auth from './containers/Auth/Auth';
import Logout from './containers/Auth/Logout/Logout';
import * as actions from './store/actions/index';

class App extends React.Component {

  componentDidMount() {
    if (!this.props.isAuthenticated) {
      this.props.onAuthCheckStatus();
    }
  }

  routes = [
    { path: "/checkout", component: Checkout, condition: () => this.props.isAuthenticated },
    { path: "/orders", component: Orders, condition: () => this.props.isAuthenticated },
    { path: "/auth", component: Auth, condition: () => !this.props.isAuthenticated },
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
