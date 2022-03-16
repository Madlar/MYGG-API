const { LeagueEntry } = require("../models/LeagueEntry")

const getLeagueEntry = (name) => {
    return new Promise(function (resolve, reject) {
        LeagueEntry.find({ summonerName: name })
        .exec((err, leagueEntry) => {
            if(err) {
                reject(err)
                return
            }
            else if(leagueEntry.length == 0) {
                resolve({
                    message: 'Unranked'
                })
            }
            else {
                resolve(leagueEntry)
            }
        })
    })
}

module.exports = { getLeagueEntry }