const {debuglog} = require("../../util/debugCommands");
const request = require('request')
const moment = require("moment")

function makeNowURL(cityName, stateCode){
  return `http://api.openweathermap.org/data/2.5/weather?q=${cityName},${stateCode}&appid=${process.env.WEATHER_API_KEY}`
}

function makeWeekURL(cityName, stateCode){
  return `http://api.openweathermap.org/data/2.5/forecast?q=${cityName},${stateCode}&appid=${process.env.WEATHER_API_KEY}`
}
function kelvinToFar(tempK){
  return (((tempK-273.15)*(9/5)) + 32).toFixed(0)
}
function makeNowResponse(body){
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

    await request.get(makeNowURL(reqBody.city, reqBody.state), async function(err,res){
      if(err || (res.statusCode !==200 && res !==null)) {
        debuglog(res)
        debuglog("error")
        debuglog(res.statusCode)
        return reject(res)
      }
      debuglog(JSON.parse(res.body))
      let temp = makeNowResponse(JSON.parse(res.body))
      debuglog("success")
      return resolve(temp)
    })
  })
}

function makeWeekResponse(body){
  let list = body.list;
  let tempList = [];
  list.forEach(forecast=>{
    tempList.push({
      "forecast_date":moment(forecast.dt*1000).format("MM-DD-YY"),
      "forecast_time":moment(forecast.dt*1000).format("h:mm:ss a"),
      "temp_forecast":kelvinToFar(forecast.main.temp),
      "forecast": forecast.weather[0].main,
      "desc": forecast.weather[0].description,
      "wind_speed":forecast.wind.speed,
      "wind_dir":forecast.wind.deg
    });
  });
  return sortWeekForecast(tempList);
}

function sortWeekForecast(list){
  let daysList=[];
  let lastDate = list[0].forecast_date
  let curDay=[{"forecast_date":lastDate}];
  let forecasts = []
  list.forEach(forecast=>{
    if(lastDate === forecast.forecast_date){
      curDay.push(forecast);
    }else{
      let maxTemp=forecast.temp_forecast;
      let minTemp=forecast.temp_forecast;
      let desc = forecast.forecast
      curDay.forEach(section=>{
        if(section.temp_forecast > maxTemp){
          maxTemp = section.temp_forecast;
        }
        if(section.temp_forecast < minTemp){
          minTemp = section.temp_forecast;
        }
      })
      curDay[0].max_temp = maxTemp;
      curDay[0].min_temp = minTemp;
      curDay[0].forecast = desc;
      if(desc.contains('clouds')){
        curDay[0].color = "#7e7e7e"
      }else if(desc.contains('sun')){
        curDay[0].color = "#fffd00"
      }else if(desc.contains('rain')){
        curDay[0].color = "#2b75ff"
      }else if(desc.contains('snow')){
        curDay[0].color = "#000094"
      }else{
        curDay[0].color = "#ff3100"
      }

      forecasts.push(curDay[0])
      daysList.push(curDay);
      curDay = [];
      lastDate = forecast.forecast_date;
      curDay.push({"forecast_date":lastDate})
      curDay.push(forecast)
    }
  })
  return forecasts;
}

function getForecastWeek(reqBody){
  debuglog(reqBody)
  return new Promise( async (resolve, reject)=>{
    await request.get(makeWeekURL(reqBody.city, reqBody.state), async function(err,res){
      debuglog(err);
      if(err || (res.statusCode !==200 && res !==undefined)) {
        //debuglog(res)
        debuglog("error")
        debuglog(res.statusCode)
        return reject(res)
      }
      debuglog(JSON.parse(res.body))
      let temp = makeWeekResponse(JSON.parse(res.body))
      debuglog("success")
      return resolve(temp)
    })
  })
}



module.exports = {getForecastNow, getForecastWeek}
