import React from 'react';

import Aux from '../../hoc/Auxiliary';

const layout = (props) => (
    <Aux>
        <div>Tollbar, SideDrawer, Backdrop</div>
        <main>
            {props.children}
        </main>
    </Aux>
);

export default layout;