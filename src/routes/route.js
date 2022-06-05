const express = require('express');
const router = express.Router();

router.get("/sol1", function (req, res) {
    
    let arr= [1,2,3,5,6,7]
  
    let total = 0;
    for (var i in arr) {
       total=total+arr[i]
    }
  
    let lastDigit= arr.pop()
    let consecutiveSum= lastDigit * (lastDigit+1) / 2
    let missingNumber= consecutiveSum - total
  
    res.send(  { data: missingNumber  }  );
  });

  router.get("/sol2", function (req, res) {
  
    let arr= [33, 34, 35, 37, 38]
    let len= arr.length
  
    let total = 0;
    for (var i in arr) {
        total += arr[i];
    }
  
    let firstDigit= arr[0]
    let lastDigit= arr.pop()
    let consecutiveSum= (len + 1) * (firstDigit+ lastDigit ) / 2
    let missingNumber= consecutiveSum - total
   
    res.send(  { data: missingNumber  }  );
  });
 
 

router.post('/players', function (req, res) {
    let players =
   [
       {
           "name": "manish",
           "dob": "1/1/1995",
           "gender": "male",
           "city": "jalandhar",
           "sports": [
               "swimming"
           ]
       },
       {
           "name": "gopal",
           "dob": "1/09/1995",
           "gender": "male",
           "city": "delhi",
           "sports": [
               "soccer"
           ]
       },
       {
           "name": "lokesh",
           "dob": "1/1/1990",
           "gender": "male",
           "city": "mumbai",
           "sports": [
               "soccer"
           ]
       },
   ]
   
    let result=[]
    
    let newPlayer = req.body
    let newPlayersName = newPlayer.name
    let isNameRepeated = false

 

    for(let i = 0; i < players.length; i++) {
        if(players[i].name == newPlayersName) {
            isNameRepeated = true;
            break;
        }
    }


    if (isNameRepeated) {
    
        res.send("This player was already added!")
    } else {
      
        result.push(newPlayer)
        res.send(result)
    }
   
})



module.exports = router;
// adding this comment for no reason