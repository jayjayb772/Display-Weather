const express = require('express');
const {getForecastNow} = require("./weatherService");
const {debuglog} = require("../../util/debugCommands");
const weatherController = express.Router()

/**
 * @swagger
 *
 * /weatherController/:
 *   get:
 *     description: gets all contact lists
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: send a text
 */
weatherController.get('/forecast-now', async (req, res) => {
    debuglog(req.query)
    await getForecastNow(req.query).then(weatherRes=>{
        //debuglog(weatherRes)
        res.send(weatherRes);
    }).catch(err=>{
        debuglog(err)
        res.status(parseInt(JSON.parse(err.body).cod)).send(err.body)
    })
})


module.exports = weatherController;
