const { riotAxios } = require('./riotAxios')

const updateMatchList = (puuid) => {
    return new Promise(function (resolve, reject) {
        riotAxios.get(`https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=20`)
            .then(listRes => {
                console.log('matchList success : true')
                resolve(listRes.data)
            })
            .catch(err => {
                reject(err)
                return
            })
    })
}

module.exports = { updateMatchList }