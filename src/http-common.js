import axios from 'axios';

export default axios.create({
    baseURL: "https://apiv4.herokuapp.com/api",
    // baseURL: "http://localhost:3001/api",
    headers: {
        "Content-type": "application/json"
    }
});