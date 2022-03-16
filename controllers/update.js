const { updateSummoner } = require('./updateSummoner')
const { updateLeagueEntry } = require('./updateLeagueEntry')
const { updateMatchList } = require('./updateMatchList')
const { updateMatch } = require('./updateMatch')

const update = (name) => {
    return new Promise(async function (resolve, reject) {
        console.log('')
        console.log('-----------------')
        console.log('Updating Summoner')
        console.log(`name: ${decodeURI(name)}`)
        console.log('-----------------')

        //영문, 숫자 이외의 문자를 uri로 받기 위해 utf8로 인코딩
        //const encodedSummonerName = encodeURI(name)
        //console.log(encodedSummonerName)
        const summonerURI = `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}`
        //const encodedSummoner = `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodedSummonerName}`

        var matchCount = 0 //match axios 횟수
        var id
        var puuid
        var matchList = new Array()

        console.log(summonerURI)

        //Riot API를 사용하여 소환사 이름으로 검색해서 소환사 정보 가져오기
        await updateSummoner(summonerURI)
            .then(response => {
                id = response.id
                puuid = response.puuid
            })
            .catch(err => {
                reject(err)
                return
            })

        console.log('LeagueEntry')
        //LeagueEntry 받아오기
        updateLeagueEntry(id, name)
            .catch(err => {
                reject(err)
                return
            })

        console.log('MatchList')
        //MatchList 받기 start = 0, count = 100 (0<100, def = 20)
        await updateMatchList(puuid)
            .then(response => {
                matchList = response
            })
            .catch(err => {
                reject(err)
                return
            })

        console.log('match')
        //전적 받아오기
        matchList.forEach((element, index) => {
            updateMatch(element, index)
                .then(response => {
                    console.log(`${index} th match success : true`)
                    matchCount += 1
                    if (matchCount == 20) {
                        console.log('')
                        console.log('-----------------')
                        console.log('Updating Complete')
                        console.log('-----------------')
                        resolve()
                    }
                })
                .catch(err => {
                    console.log(`${index} th match success : false`)
                    if (err.hasOwnProperty('response')) {
                        if (err.response.hasOwnProperty('status')) {
                            console.log(err.response.status)
                            console.log(err.response.data)
                        }
                        else console.log(err)
                    }
                    else console.log(err)

                    matchCount += 1
                    if (matchCount == 20) {
                        console.log('')
                        console.log('-----------------')
                        console.log('Updating Complete')
                        console.log('-----------------')
                        resolve()
                    }
                })
        })
    })
}

module.exports = { update }