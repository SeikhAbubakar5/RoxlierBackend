const axios=require ('axios')

const fetchData=async()=>{
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        console.log(response)
        return response.data;
        
    } catch (error) {
        console.log(error)
        throw new Error('Failed to fetch data from API');
    }
}
module.exports=fetchData;