import React from 'react';

import Modal from '../Modal/Modal';
import Aux from '../../../hoc/Auxiliary/Auxiliary';

const withErrorHandler = (WrappedComponent, axios) => {
    return class extends React.Component {
        state = {
            error: null
        }

        componentWillMount() {
            axios.interceptors.request.use(req => {
                this.errorConfirmedHandler();

                return req;
            });
            axios.interceptors.response.use(res => res, error => {
                this.setState({ error: error });
            });
        }

        errorConfirmedHandler = () => {
            this.setState({ error: null });
        }

        render() {
            return (
                <Aux>
                    <Modal show={this.state.error}
                        modalClosed={this.errorConfirmedHandler}>
                        {this.state.error ? this.state.error.message : null}
                    </Modal>
                    <WrappedComponent {...this.props} />
                </Aux>
            );
        }
    }
};

export default withErrorHandler;