import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-burger-builder-4026b.firebaseio.com/'
});

export default instance;