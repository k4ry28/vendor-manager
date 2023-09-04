// function to handle fetch for swr 

const fetcher = (...args) => 
  fetch(...args)
    .then(res => res.json())
    .catch(err => console.log('Error fetching data: ', err)); 


export default fetcher;