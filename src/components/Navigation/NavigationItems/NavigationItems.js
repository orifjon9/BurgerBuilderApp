import React from 'react';

import NavigationItem from './NavigationItem/NavigationItem';
import classes from './NavigationItems.css';
import Aux from '../../../hoc/Auxiliary/Auxiliary';

const navigationItems = (props) => (
    <ul className={classes.NavigationItems}>
        <NavigationItem link="/" exact>Burger Builder</NavigationItem>
        {props.isAuth
            ? <Aux>
                <NavigationItem link="/logout">Logout</NavigationItem>
                <NavigationItem link="/orders">Orders</NavigationItem>
            </Aux>
            : <NavigationItem link="/auth">Authenticate</NavigationItem>
        }
    </ul>
);

export default navigationItems;