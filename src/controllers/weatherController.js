let axios = require("axios")
let weatherOfLondon = async function (req, res) {
    let london = req.query.q
    let apiKey = req.query.appid
    console.log(`query params are:${london}${apiKey}`)
    var options = {
        method: "get",
        url: `http://api.openweathermap.org/data/2.5/weather?q=${london}&appid=${apiKey}`

    }
    let result = await axios(options)
    console.log(result.data)
    res.status(200).send({ msg: result.data })
}
let temperatureOfLondon = async function (req, res) {
    let london = req.query.q
    let apiKey = req.query.appid
    console.log(`query params are:${london}${apiKey}`)
    var options = {
        method: "get",
        url: `http://api.openweathermap.org/data/2.5/weather?q=${london}&appid=${apiKey}`

    }
    let result = await axios(options)
    console.log(result.data)
    res.status(200).send({ msg: result.data.main["temp"] })
}
let cityWeather = async function (req, res) {
    let arr = ["Bengaluru", "Mumbai", "Delhi", "Kolkata", "Chennai", "London", "Moscow"]
    let datas = []
    for (let i = 0; i < arr.length; i++) {
        var obj = { city: arr[i] }

        let cities = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${arr[i]}&appid=d781a45ed92c787e52c669cfa5be6b12`)
        console.log({ message: cities })
        obj.temp = cities.data.main["temp"]
       
        datas.push(obj)
       
    }
    var sorted=datas.sort(function(a,b){return a.temp-b.temp})
  
    res.status(200).send({ msg:sorted })
}





module.exports.weatherOfLondon = weatherOfLondon
module.exports.temperatureOfLondon = temperatureOfLondon
module.exports.cityWeather = cityWeather