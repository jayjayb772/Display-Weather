const {debuglog} = require("../../util/debugCommands");
const request = require('request')
const moment = require("moment")

function makeURL(cityName, stateCode){
  return `http://api.openweathermap.org/data/2.5/weather?q=${cityName},${stateCode}&appid=${process.env.WEATHER_API_KEY}`
}
function kelvinToFar(tempK){
  return (((tempK-273.15)*(9/5)) + 32).toFixed(0)
}
function makeResponse(body){
  return {
    "forecast-time":moment(body.dt*1000).format("dddd, MMMM Do YYYY, h:mm:ss a"),
    "temps":{
      "temp_now":kelvinToFar(body.main.temp),
      "temp_min":kelvinToFar(body.main.temp_min),
      "temp_max":kelvinToFar(body.main.temp_max),
    },
    "forecasts": {
      "forecast": body.weather[0].main,
      "desc": body.weather[0].description
    },
    "wind":{
      "speed":body.wind.speed,
      "dir":body.wind.deg
    },
    "sunStuff":{
      "sunrise":moment(body.sys.sunrise*1000).format("dddd, MMMM Do YYYY, h:mm:ss a"),
      "sunset":moment(body.sys.sunset*1000).format("dddd, MMMM Do YYYY, h:mm:ss a")
    }

  }
}


function getForecastNow(reqBody){
  debuglog(reqBody)
  return new Promise( async (resolve, reject)=>{
    await request.get(makeURL(reqBody.city, reqBody.state), async function(err,res){
      if(err || (res.statusCode !==200 && res !==null)) {
        debuglog(res)
        debuglog("error")
        debuglog(res.statusCode)
        return reject(res)
      }
      debuglog(JSON.parse(res.body))
      let temp = makeResponse(JSON.parse(res.body))
      debuglog("success")
      return resolve(temp)
    })
  })
}



module.exports = {getForecastNow}
