const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser')
const axios = require('axios')

const config = require('./config/key')

const { getLeagueEntry } = require('./controllers/getLeagueEntry')
const { getMatch } = require('./controllers/getMatch')
const { getSummoner } = require('./controllers/getSummoner')
const { update } = require('./controllers/update')

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
app.post('/api/updateSummoner', (req, res) => {

  update(req.body.name)
  .then(response => {
    return res.status(200).json({ success: true })
  })
  .catch(err => {
    if(err.hasOwnProperty('response')) {
      if(err.response.hasOwnProperty('status')) {
        console.log(err.response.status)
        console.log(err.response.data)
        return res.status(err.response.status).json(err.response.data)
      }
      else {
        console.log(err)
        return res.send(err)
      }
    }
    else {
      console.log(err)
      return res.send(err)
    }
  })
})

//db에서 소환사 정보 찾기
app.get('/api/getSummoner', (req, res) => {
  //우선db에서 검색
  getSummoner(req.query.name)
  .then(response => {

    //검색결과가 없다면
    if(response == false) {

      //update실행
      // utf-8로 변환
      update(encodeURI(req.query.name))
      .then(updateRes => {

        //다시 한번 검색해본후
        getSummoner(req.query.name)
        .then(secondGetSumRes => {
          //그래도 없으면 404
          if(secondGetSumRes == false) {
            res.status(404).json({
              status: 404,
              message: 'Can not found - summoner',
              searchSuccess: false
            })
          }
          //그랬는데 있다면 검색결과 보내줌
          else {
            res.status(200).json(secondGetSumRes)
          }
        })
        .catch(err => {
          //다시 검색 했을 때 에러가 생겼다면
          res.send(err)
        })

      })
      .catch(err => {
        //update에서 에러가 생겼다면
        if(err.hasOwnProperty('response')) {
          if(err.response.hasOwnProperty('status')) {
            console.log(err.response.status)
            console.log(err.response.data)
            return res.status(err.response.status).json(err.response.data)
          }
          else {
            console.log(err)
            return res.send(err)
          }
        }
        else {
          console.log(err)
          return res.send(err)
        }
      })

    }
    //첫 검색에 결과가 있다면
    else {
      res.status(200).json(response)
    }
  })//첫 검색에서 에러가 생겼다면
  .catch(err => {
    res.send(err)
  })
})

//db에서 LeagueEntry 찾기
app.get('/api/getLeagueEntry', (req, res) => {
  getLeagueEntry(req.query.name)
  .then(response => {
    res.json(response)
  })
  .catch(err => {
    res.send(err)
  })
})

//db에서 Match 찾기
app.get('/api/getMatch', (req, res) => {
  const start = Number(req.query.start)
  const count = Number(req.query.count)
  getMatch(start, count, req.query.name)
  .then(response => {
    if(response == false) {
      res.status(204).json({ message: 'no record' })
    }
    else {
      res.status(200).json(response)
    }
  })
  .catch(err => {
    res.send(err)
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})