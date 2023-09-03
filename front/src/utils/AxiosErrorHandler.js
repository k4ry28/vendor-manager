/* 
    Function to handle errors in axios requests
    
    @param error object
    @return object
*/

export default function errorHandler(error) {

    if (error.response) {
        // The request was made and the server responded with a status code that falls out of the range of 2xx           
        console.error(error.response.data);
        return { error: true, status: error.response.status, data: error.response.data};
    } else if (error.request) {
        // The request was made but no response was received
        let message = `Can't connect to the server: ${error.request._currentUrl?? `URL not available`}`;
        console.error(message);
        return { error: true, status: 500, data: message, message: `Can't connect to the server.`}
    } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error', error.message);
        return { error: true, status: 500, data: error.message, message: 'Error on request'}
    }
}