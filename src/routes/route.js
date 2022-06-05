const express = require('express');

const _ = require ('underscore')
const lodash = require ('lodash')
const router = express.Router();

   // Q-2
    router.get('/movie/:indexNumber',function (req, res){
        
    let movie=["Rang de basanti", "The shining", "Lord of the rings", "Batman begins"]
    let index =req.params.indexNumber
    console.log(movie)
    res.send(movie[index])
    })

   
// // Q-3
router.get('/movie/:indexNumber',function (req, res){
    let movie=["Rang de basanti", "The shining", "Lord of the rings", "Batman begins"]
    let index = req.params.indexNumber
    if (indexNumber=movie[index]){
        res.send(movie[index])
    }else{
        res.send("use a valid index")
    }
    })

    // Q-4

router.get('/Film',function (req, res){
    let MovieObject=[ {
        id: 1,
        name: 'The Shining'
       }, {
        id: 2,
        name: 'Incendies'
       }, {
        id: 3,
        name: 'Rang de Basanti'
       }, {
        id: 4,
        name: 'Finding Nemo'
       }]
    //    let movie=req.params.Film
       
    // })
    console.log(MovieObject)
    res.send(MovieObject)
})

// // // Q-5

router.get('/Film/:FilmId',function (req, res){  
let MovieObject=[{id: 1,
        name: 'The Shining'
       }, {
        id: 2,
        name: 'Incendies'
       }, {
        id: 3,
        name: 'Rang de Basanti'
       }, {
        id: 4,
        name: 'Finding Nemo'
       }]
       let film= req.params.FilmId
    
    for(let index=0;index<MovieObject.length;index++){
    //   let FilmId=MovieObject[index].id
       if(FilmId=MovieObject[index].id){
           res.send (MovieObject[index]["name"])
           break
       }else{
        res.send("No movie exist with this id")
       }
      
    }
    
    })

//     // Q-1
router.get('/Movie', function (req, res) {
    
let movieName=["Rang de basanti", "The shining", "Lord of the rings", "Batman begins"]
console.log(movieName)
// let VISHAL=req.params.Movie
// console.log(movieName)
res.send(movieName)
})





module.exports = router;
// adding this comment for no reason