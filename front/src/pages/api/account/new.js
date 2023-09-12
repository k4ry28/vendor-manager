import axios from 'axios';
import errorHandler from '@/utils/AxiosErrorHandler.js'


export default async function handler (req, res) {
 
    const session = req.cookies.auth_service;

    if (!session)
        return res.status(401).json({ error: 'Unauthorized' });

    const user_id = req.query.user_id;
   
    let response = await axios.post(`${process.env.API_URL}/accounts/user/${user_id}`, req.body, {
        headers: {
            'Authorization': `Bearer ${session}`
        }
    })
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