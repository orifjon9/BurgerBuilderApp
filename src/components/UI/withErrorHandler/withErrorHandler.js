import React, { useState, useEffect } from 'react';

import Modal from '../Modal/Modal';
import Aux from '../../../hoc/Auxiliary/Auxiliary';

const withErrorHandler = (WrappedComponent, axios) => {
    return props => {
        const [error, setError] = useState(null);

        const reqInterpector = axios.interceptors.request.use(req => {
            errorConfirmedHandler();
            return req;
        });
        const resInterpector = axios.interceptors.response.use(res => res, err => {
            setError(err);
        });

        useEffect(() => {
            return () => {
                axios.interceptors.request.eject(reqInterpector);
                axios.interceptors.response.eject(resInterpector);
            };
        }, [reqInterpector, resInterpector]);

        const errorConfirmedHandler = () => {
            setError(null);
        }

        return (
            <Aux>
                <Modal show={error}
                    modalClosed={errorConfirmedHandler}>
                    {error ? error.message : null}
                </Modal>
                <WrappedComponent {...props} />
            </Aux>
        );
    }
};

export default withErrorHandler;