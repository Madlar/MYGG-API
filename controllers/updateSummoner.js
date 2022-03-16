const { Summoner } = require("../models/Summoner")
const { riotAxios } = require('./riotAxios')

const updateSummoner = (encodedSummoner) => {
    return new Promise(function (resolve, reject) {
        riotAxios.get(encodedSummoner)
            .then(axiosRes => {

                const summoner = new Summoner(axiosRes.data)

                //summoner가 새로운 Summoner document이므로
                //findOneAndUpdate에 수정 파라미터로 summoner을 넣을경우 _id도 변경하려 시도해서
                //code: 66 ImmutableField가 발생한다
                var summoner_updated = JSON.parse(JSON.stringify(summoner))
                //_id를 제거하기위해 summoner를 스트링으로 변환하고 다시 JSON으로 변환한뒤 _id를 지우는 꼼수
                delete summoner_updated._id

                Summoner.findOneAndUpdate({ name: summoner.name }, summoner_updated, {
                    upsert: true, //없으면 생성
                    overwrite: true, //기존 다큐먼트 덮어쓰기
                    new: true // update적용후의 값을 반환해줌 default : false
                })
                .exec((err, doc) => {
                    if (err) {
                        reject({ 'Summoner success': false, err })
                        return
                    }
                    else if(doc) {
                        console.log('Summoner success : true')
                        console.log('')
                        resolve(doc)
                    }
                });
                

            })
            .catch(err => {
                reject(err)
                return
            })
    })
}

module.exports = { updateSummoner }