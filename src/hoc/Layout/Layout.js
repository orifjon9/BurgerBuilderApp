import React, { useState } from 'react';
import { connect } from 'react-redux';

import Aux from '../Auxiliary/Auxiliary';
import classes from './Layout.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

const Layout = props => {
    const [sideDrawerIsVisable, setSideDrawIsVisable] = useState(false);

    const closeSideDrawerHandler = () => {
        setSideDrawIsVisable(false);
    };

    const sideDrawerToggleHandler = () => {
        setSideDrawIsVisable(!sideDrawerIsVisable);
    }

    return (<Aux>
        <Toolbar isAuth={props.isAuthenticated} drawerToggleClicked={sideDrawerToggleHandler} />
        <SideDrawer isAuth={props.isAuthenticated} show={sideDrawerIsVisable} closed={closeSideDrawerHandler} />
        <main className={classes.Content}>
            {props.children}
        </main>
    </Aux>)
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null
    };
};

export default connect(mapStateToProps)(Layout);