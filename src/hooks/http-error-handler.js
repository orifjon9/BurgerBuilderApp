import { useState, useEffect } from 'react';

export default httpClient => {
    const [error, setError] = useState(null);

    const reqInterpector = httpClient.interceptors.request.use(req => {
        errorConfirmedHandler();
        return req;
    });
    const resInterpector = httpClient.interceptors.response.use(res => res, err => {
        setError(err);
    });

    useEffect(() => {
        return () => {
            httpClient.interceptors.request.eject(reqInterpector);
            httpClient.interceptors.response.eject(resInterpector);
        };
    }, [reqInterpector, resInterpector]);

    const errorConfirmedHandler = () => {
        setError(null);
    }

    return [error, errorConfirmedHandler];
};