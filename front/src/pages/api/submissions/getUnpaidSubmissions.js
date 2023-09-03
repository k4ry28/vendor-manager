import axios from 'axios';
import errorHandler from '@/utils/AxiosErrorHandler.js'


export default async function handler (req, res) {
 
    const session = req.cookies.auth_service;

    if (!session)
        return res.status(401).json({ error: 'Unauthorized' });

    const account_id = req.query.account_id;
   
    let response = await axios.get(`${process.env.API_URL}/submissions/unpaid?account_id=${account_id}`, {
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