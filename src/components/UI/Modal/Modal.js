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


class Modal extends React.Component {

    // shouldComponentUpdate(nextProps, nextState) {
    //     return nextProps.show !== this.props.show || nextProps.children !== this.props.children;
    // }

    render() {
        const cssClasses = [classes.Modal, (this.props.state === 'entering' ? classes.ModalOpen : (this.props.state === 'exiting' ? classes.ModalClosed : null))];
        if (!this.props.show) {
            return null;
        }

        return (
            <Aux>
                <Backdrop show={this.props.show} clicked={this.props.modalClosed} />
                <div
                    className={cssClasses.join(' ')}>
                    {this.props.children}
                </div>
            </Aux>
        );
    }
}

export default Modal;