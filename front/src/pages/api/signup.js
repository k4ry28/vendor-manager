import axios from 'axios';
import errorHandler from '@/utils/AxiosErrorHandler.js'


export default async function handler (req, res) {
 
    let response = await axios.post(`${process.env.API_URL}/auth/signup`, req.body)
        .then(response => {
            //console.log(response.data);
            return response;
        })
        .catch(error => {
            let errorResponse = errorHandler(error);
            return errorResponse;
        });

    res.status(response.status).json(response.data ? response.data : response);
}