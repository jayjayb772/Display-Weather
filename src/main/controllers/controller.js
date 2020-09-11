const express = require('express');
const {debuglog} = require("../util/debugCommands");
const controller = express.Router()

/**
 * @swagger
 *
 * /controller/:
 *   get:
 *     description: gets all contact lists
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: send a text
 */
controller.get('/', (req, res) => {
    debuglog("controller home")
    res.send("controller home");
})


module.exports = controller;
