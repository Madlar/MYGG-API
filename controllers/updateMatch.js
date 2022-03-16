const { Match } = require('../models/Match')
const { riotAxios } = require('./riotAxios')

const updateMatch = (match, index) => {
    return new Promise(function (resolve, reject) {
        riotAxios.get(`https://asia.api.riotgames.com/lol/match/v5/matches/${match}`)
            .then(matchRes => {

                const match = new Match(matchRes.data)

                if(match.info.gameType != 'MATCHED_GAME') {
                    reject({ message: 'not MATCHED_GAME' })
                    return
                }

                var match_updated = JSON.parse(JSON.stringify(match))
                delete match_updated._id

                Match.findOneAndReplace({ 'metadata.matchId': match.metadata.matchId }, match_updated, {
                    upsert: true
                })
                .exec((err, doc) => {
                    if (err) {
                        reject(err)
                        return
                    }
                    else {
                        resolve()
                    }
                })
            })
            .catch(err => {
                reject(err)
                return
            })
    })
}

module.exports = { updateMatch }