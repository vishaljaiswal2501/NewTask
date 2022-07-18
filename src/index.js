const express=require('express')
const mongoose= require('mongoose')

const app=express()

app.use(express.json())

// app.use('/', route);

app.get('/',(req,res)=>{
    res.status(200).send('Its working')
})

app.listen(process.env.PORT || 3000, function () {
    console.log(`Express app running on port ${process.env.PORT || 3000}`);
});