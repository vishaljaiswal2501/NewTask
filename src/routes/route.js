const express = require('express');
const router = express.Router();
const CowinController= require("../controllers/cowinController")
const weatherController= require("../controllers/weatherController")
const memesController= require("../controllers/memesController")



router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})


router.get("/cowin/states", CowinController.getStates)
router.get("/cowin/districtsInState/:stateId", CowinController.getDistricts)
router.get("/cowin/getByPin", CowinController.getByPin)

router.post("/cowin/getOtp", CowinController.getOtp)
router.get("/cowin/getbydistrict", CowinController.getByDistrict)
router.get("/weather/getweatheroflondon", weatherController.weatherOfLondon)
router.get("/weather/gettemperatureoflondon", weatherController.temperatureOfLondon)
router.get("/weather/gettemperatureofcities", weatherController.cityWeather)
router.get("/getMemes", memesController.getAllMemes)
router.get("/getMemesid", memesController.memeId)
router.post("/getMemepost", memesController.memehandle)

// WRITE A GET API TO GET THE LIST OF ALL THE "vaccination sessions by district id" for any given district id and for any given date



module.exports = router;