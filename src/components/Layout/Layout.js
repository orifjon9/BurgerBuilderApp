import React from 'react';

import Aux from '../../hoc/Auxiliary';
import classes from './Layout.css';
import Toolbar from '../Navigation/Toolbar/Toolbar';
import SideDrawer from '../Navigation/SideDrawer/SideDrawer';

class Layout extends React.Component {
    state = {
        showSideDrawer: true
    };

    closeSideDrawerHandler = () => {
        this.setState({ showSideDrawer: false });
    };

    render() {
        return (<Aux>
            <Toolbar />
            <SideDrawer show={this.state.showSideDrawer} closed={this.closeSideDrawerHandler} />
            <main className={classes.Content}>
                {this.props.children}
            </main>
        </Aux >)
    }
}

export default Layout;