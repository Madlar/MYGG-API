const mongoose = require('mongoose')

const leagueEntrySchema = mongoose.Schema({
    leagueId: {
        type: String
    },
    summonerId: {//	Player's encrypted summonerId.
        type: String
    },
    summonerName: {
        type: String
    },
    queueType: {
        type: String
    },
    tier: {
        type: String
    },
    rank: {// The player's division within a tier.
        type: String
    },
    leaguePoints: {
        type: Number
    },
    wins: {// Winning team on Summoners Rift.
        type: Number
    },
    losses: {//Losing team on Summoners Rift.
        type: Number
    },
    hotStreak: {
        type: Boolean
    },
    veteran: {
        type: Boolean
    },
    freshBlood: {
        type: Boolean
    },
    inactive: {
        type: Boolean
    }
})

const LeagueEntry = mongoose.model('LeagueEntry', leagueEntrySchema)

module.exports = { LeagueEntry }