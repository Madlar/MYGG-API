const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser')
const axios = require('axios')

const config = require('./config/key')

const { Summoner } = require("./models/Summoner")
const { LeagueEntry } = require("./models/LeagueEntry")
const { Match } = require("./models/Match")

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}))
//application/json
app.use(bodyParser.json());

//riot api로 데이터를 받을 axios
const riotAxios = axios.create({
  headers: {
    'X-Riot-Token': config.riotAPIKey
  }
})

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/api/hello', (req, res) => {
  res.send('hello')
})

//riot 서버에서 소환사 정보, 전적 갱신받기
app.post('/api/updateSummoner', async (req, res) => {

  console.log('')
  console.log('-----------------')
  console.log('Updating Summoner')
  console.log(`name: ${req.body.name}`)
  console.log('-----------------')

  //영문, 숫자 이외의 문자를 uri로 받기 위해 uft8로 인코딩
  const summonerURI = `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${req.body.name}`
  const encodedSummoner = encodeURI(summonerURI)

  var matchCount = 0 //match axios 횟수
  var id
  var puuid
  var matchList = new Array()

  console.log(encodedSummoner)
  
  //Riot API를 사용하여 소환사 이름으로 검색해서 소환사 정보 가져오기
  await riotAxios.get(encodedSummoner)
  .then(axiosRes => {

    const summoner = new Summoner(axiosRes.data)
    id = summoner.id
    puuid = summoner.puuid

    //summoner가 새로운 Summoner document이므로
    //findOneAndUpdate에 수정 파라미터로 summoner을 넣을경우 _id도 변경하려 시도해서
    //code: 66 ImmutableField가 발생한다
    var summoner_updated = JSON.parse(JSON.stringify(summoner))
    //_id를 제거하기위해 summoner를 스트링으로 변환하고 다시 JSON으로 변환한뒤 _id를 지우는 꼼수
    delete summoner_updated._id

    Summoner.findOneAndUpdate({ accountId: summoner.accountId }, summoner_updated, {
      upsert: true, //없으면 생성
      overwrite: true //기존 다큐먼트 덮어쓰기
    }, (err, doc) => {
      if (err) return res.json({ 'Summoner success': false, err })
    });
    console.log('Summoner success : true')
    console.log('')

  })
  .catch(err => {
    if(err.hasOwnProperty('response')) {
      if(err.response.hasOwnProperty('status')) {
        console.log(err.response.status)
        console.log(err.response.data)
        return res.status(err.response.status).json(err.response.data)
      }
      else return console.log(err)
    }
    else
    return console.log(err)
  })

  console.log('LeagueEntry')
  //LeagueEntry 받아오기
  await riotAxios.get(`https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}`)
  .then(entryRes => {//json 배열로 값이 넘어옴
    if(entryRes.data.length !== 0) {
      entryRes.data.forEach(element => {

        var leagueEntry = new LeagueEntry(element)
        var leagueEntry_updated = JSON.parse(JSON.stringify(leagueEntry))
        delete leagueEntry_updated._id

        LeagueEntry.findOneAndUpdate({ summonerId: id, queueType: leagueEntry_updated.queueType }, leagueEntry_updated, {
          upsert: true,
          overwrite: true
        }, (err, doc) => {
          if (err) return res.json({ 'LeagueEntry success': false, err })
        })

      });
      console.log('LeagueEntry success : true')
    }
    else {
      console.log('LeagueEntry success : Unranked')
    }
    
  })
  .catch(err => {
    if(err.hasOwnProperty('response')) {
      if(err.response.hasOwnProperty('status')) {
        console.log(err.response.status)
        console.log(err.response.data)
      }
      else return console.log(err)
    }
    else
    return console.log(err)
  })

  console.log('MatchList')
  //MatchList 받기 start = 0, count = 100 (0<100, def = 20)
  await riotAxios.get(`https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=20`)
  .then(listRes => {
    matchList = listRes.data
    console.log('matchList success : true')

    //return res.status(200).json({ success: true })

  })
  .catch(err => {
    if(err.hasOwnProperty('response')) {
      if(err.response.hasOwnProperty('status')) {
        console.log(err.response.status)
        console.log(err.response.data)
      }
      else return console.log(err)
    }
    else
    return console.log(err)
  })

  //전적 받아오기
  matchList.forEach((element, index, array) => {
    riotAxios.get(`https://asia.api.riotgames.com/lol/match/v5/matches/${element}`)
    .then(matchRes => {

      const match = new Match(matchRes.data)
      var match_updated = JSON.parse(JSON.stringify(match))
      delete match_updated._id

      Match.findOneAndReplace({ 'metadata.matchId': match.metadata.matchId }, match_updated, {
        upsert: true
      }, (err, doc) => {
        if (err) {
          const temp = `${index} th match success : false`
          console.log(temp)
          console.log(err)

          matchCount += 1
          if(matchCount == 20) {//20번째 axios가 끝나면 return
            console.log('')
            console.log('-----------------')
            console.log('Updating Complete')
            console.log('-----------------')
            return res.status(200).json({ success: true })
          }
        }
        else {
          const temp = `${index} th match success : true`
          console.log(temp)

          matchCount += 1
          if(matchCount == 20) {//20번째 axios가 끝나면 return
            console.log('')
            console.log('-----------------')
            console.log('Updating Complete')
            console.log('-----------------')
            return res.status(200).json({ success: true })
          }
        }
      })
      

    })
    .catch(err => {
      if(err.hasOwnProperty('response')) {
        if(err.response.hasOwnProperty('status')) {
          console.log(err.response.status)
          console.log(err.response.data)
        }
        else return console.log(err)
      }
      else
      return console.log(err)

      matchCount += 1
      if(matchCount == 20) {//20번째 axios가 끝나면 return
        console.log('')
        console.log('-----------------')
        console.log('Updating Complete')
        console.log('-----------------')
        return res.status(200).json({ success: true })
      }
    })
  })

})

//riot 서버에서 인게임 정보 받기
app.get('/api/inGameInfo', (req, res) => {

  const summonerIdURI = `https://kr.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${req.body.id}`
  const encodedSummonerId = encodeURI(summonerIdURI)

  riotAxios.get(encodedSummonerId)
  .then(inGameRes => {
    return res.status(200).json(inGameRes.data)
  })
  .catch(err => {
    if(err.hasOwnProperty('response')) {
      if(err.response.hasOwnProperty('status')) {
        return res.status(err.response.status).json(err.response.data)
      }
      else return res.send(err)
    }
    else
    return res.send(err)
  })

})

//db에서 소환사 정보 찾기
app.get('/api/getSummoner', (req, res) => {
  console.log(req.query)
  Summoner.findOne({ name: req.query.name })
  .exec((err, summoner) => {
    if(err){
      res.send(err)
    }
    else if(!summoner) {
      res.status(404).json({
        status: 404,
        message: 'Can not found - summoner',
        searchSuccess: false
      })
    }
    else {
      res.status(200).json({ searchSuccess: true, Summoner: summoner })
    }
  })

})

//db에서 LeagueEntry 찾기
app.get('/api/getLeagueEntry', (req, res) => {
  LeagueEntry.find({ summonerName: req.query.name })
  .exec((err, leagueEntry) => {
    //console.log(leagueEntry)
    if(err) {
      res.send(err)
    }
    else if(leagueEntry.length == 0) {
      res.status(200).json({
        message: 'Unranked'
      })
    }
    else {
      res.status(200).json(leagueEntry)
    }
  })

})

//db에서 Match 찾기
app.get('/api/getMatch', (req, res) => {
  const start = Number(req.query.start)
  const count = Number(req.query.count)
  Match.find( {"info.participants.summonerName": req.query.name })
  .sort({ "info.gameCreation": -1})
  .exec((err, match) => {
    if(err) {
      res.send(err)
    }
    else {
      if(match.length <= start) {
        res.status(204).json({ message: 'no record' })
      }
      else {
        const result = match.slice(start, start + count)
        res.status(200).json(result)
      }
    }
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})