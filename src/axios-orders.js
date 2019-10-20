import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-burger-app-cdd66.firebaseio.com/'
});

export default instance;