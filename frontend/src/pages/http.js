import axios from "axios";

axios.defaults.withCredentials = true;
const http = axios.create({
            baseURL: '/api',
            headers: {'content-type' : 'application/json'}
        })

        http.interceptors.response.use(
            (res) => res,
            (err) => {
                console.error('API error : ', err.response?.data || err.message)
                return Promise.reject(err)
            }
)

export default http