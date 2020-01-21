import React from 'react';

import classes from './Modal.css';
import Aux from '../../../hoc/Auxiliary/Auxiliary';
import Backdrop from '../Backdrop/Backdrop';


// More on CSS Transitions: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions/Using_CSS_transitions
// More on CSS Animations: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations
// More on ReactTransitionGroup: https://github.com/reactjs/react-transition-group
// Alternative => React Motion: https://github.com/chenglou/react-motion
// Alternative => React Move: https://github.com/react-tools/react-move
// Animating Route Animations: https://github.com/maisano/react-router-transition


const Modal = props => {

    // shouldComponentUpdate(nextProps, nextState) {
    //     return nextProps.show !== this.props.show || nextProps.children !== this.props.children;
    // }

        const cssClasses = [classes.Modal, (props.state === 'entering' ? classes.ModalOpen : (props.state === 'exiting' ? classes.ModalClosed : null))];
        if (!props.show) {
            console.log('return null');
            return null;
        }

        return (
            <Aux>
                <Backdrop show={props.show} clicked={props.modalClosed} />
                <div
                    className={cssClasses.join(' ')}>
                    {props.children}
                </div>
            </Aux>
        );
}

export default React.memo(Modal, (prevProps, nextProps) => nextProps.show !== prevProps.show || nextProps.children !== prevProps.children);