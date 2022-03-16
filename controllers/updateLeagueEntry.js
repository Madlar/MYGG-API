const { LeagueEntry } = require("../models/LeagueEntry")
const { riotAxios } = require('./riotAxios')

const updateLeagueEntry = (id, name) => {
    return new Promise(function (resolve, reject) {
        riotAxios.get(`https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}`)
            .then(entryRes => {//json 배열로 값이 넘어옴
                if (entryRes.data.length !== 0) {
                    entryRes.data.forEach(element => {

                        //updateSummoner 참조
                        var leagueEntry = new LeagueEntry(element)
                        var leagueEntry_updated = JSON.parse(JSON.stringify(leagueEntry))
                        delete leagueEntry_updated._id

                        LeagueEntry.findOneAndUpdate({ summonerName: name, queueType: leagueEntry_updated.queueType }, leagueEntry_updated, {
                            upsert: true,
                            overwrite: true
                        })
                        .exec((err, doc) => {
                            if (err) {
                                reject({ 'LeagueEntry success': false, err })
                            }
                            else {
                                resolve()
                            }
                        })

                    });
                    console.log('LeagueEntry success : true')
                    resolve()
                }
                else {
                    console.log('LeagueEntry success : Unranked')
                    resolve()
                }

            })
            .catch(err => {
                reject(err)
                return
            })
    })
}

module.exports = { updateLeagueEntry }