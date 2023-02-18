const axios = require('axios');

const ErrorLib = require('lib/basic/ErrorLib');
const Utility = require('lib/Utility');
const config = require('config/entry');
const Joi = require('joi');

class dataController {
  static async getOne(req, res) {
    // validation
    const { query } = req;
    const querySchema = Joi.object({
      user: Joi.number().integer().min(1).max(1000),
    }).options({ stripUnknown: true });
    await querySchema.validateAsync(query);

    // main
    let response = {};
    try {
      // @ts-ignore
      response = await axios.get(config.dataUrl);
    } catch (error) {
      throw new ErrorLib.SystemError({ msg: 'Request got error', data: {} });
    }
    res.ok(JSON.parse(Utility.stringify(response)));
  }
}

module.exports = dataController;
