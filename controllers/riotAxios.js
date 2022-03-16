const axios = require('axios')
const config = require('../config/key')

//riot api로 데이터를 받을 axios
const riotAxios = axios.create({
    headers: {
      'X-Riot-Token': config.riotAPIKey
    }
})

module.exports = { riotAxios }