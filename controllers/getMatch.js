const { Match } = require("../models/Match")

const getMatch = (start, count, name) => {
    return new Promise(function (resolve, reject) {
        Match.find({ "info.participants.summonerName": name })
            .sort({ "info.gameCreation": -1 })
            .exec((err, match) => {
                if (err) {
                    reject(err)
                    return
                }
                else {
                    if (match.length <= start) {
                        resolve(false)
                    }
                    else {
                        const result = match.slice(start, start + count)
                        resolve(result)
                    }
                }
            })
    })
}

module.exports = { getMatch }