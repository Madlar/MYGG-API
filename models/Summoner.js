const mongoose = require('mongoose')

const summonerSchema = mongoose.Schema({
    accountId: {//Encrypted account ID.
        type: String,
        maxlength: 56
    },
    profileIconId: {//ID of the summoner icon associated with the summoner.
        type: Number
    },
    revisionDate: {//Date summoner was last modified specified as epoch milliseconds. The following events will update this timestamp: summoner name change, summoner level change, or profile icon change.
        type: Number
    },
    name: {//Summoner name.
        type: String
    },
    id: {//Encrypted summoner ID.
        type: String,
        maxlength: 63
    },
    puuid: {//Encrypted PUUID.
        type: String,
        maxlength: 78
    },
    summonerLevel: {//Summoner level associated with the summoner.
        type: Number
    }
})

const Summoner = mongoose.model('Summoner', summonerSchema)

module.exports = { Summoner }