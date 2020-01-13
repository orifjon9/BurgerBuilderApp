import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Logout from './containers/Auth/Logout/Logout';
import * as actions from './store/actions/index';
import asyncComponent from './hoc/asyncComponent/asyncComponent';

const app = props => {
  
  useEffect(() => {
    if (!props.isAuthenticated) {
      props.onAuthCheckStatus();
    }
  }, []);

  let routes = [
    { path: "/checkout", component: asyncComponent(() => import('./containers/Checkout/Checkout')), condition: () => props.isAuthenticated },
    { path: "/orders", component: asyncComponent(() => import('./containers/Orders/Orders')), condition: () => props.isAuthenticated },
    { path: "/auth", component: asyncComponent(() => import('./containers/Auth/Auth')), condition: () => !props.isAuthenticated },
    { path: "/logout", component: Logout, condition: () => props.isAuthenticated },
    { path: "/", component: BurgerBuilder, condition: () => true }
  ];


  return (
    <div>
      <Layout>
        <Switch>
          {
            routes.filter(f => f.condition()).map(route => <Route path={route.path} component={route.component} />)
          }
        </Switch>
      </Layout>
    </div>
  );
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

export default connect(mapStateToProps, mapDispatchToProps)(app);
