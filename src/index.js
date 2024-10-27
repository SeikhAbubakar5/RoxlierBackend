require('dotenv').config({path:'src/.env'})
const express =require ('express')
const cors=require("cors")
const transactionRoutes=require('./Routes/TransactionsRoutes')
const app =express()
app.use(cors());

app.use('/api', transactionRoutes);


const PORT=process.env.PORT|| 8000
app.listen (PORT ,()=>{
    console.log(`Server start Listining on PORT ${PORT}`)
})