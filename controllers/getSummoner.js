const { Summoner } = require("../models/Summoner")

const getSummoner = (name) => {
    return new Promise(function (resolve, reject) {
        Summoner.findOne({ name: name })
            .exec((err, summoner) => {
                if (err) {
                    reject(err)
                    return
                }
                else if (!summoner) {
                    resolve(false)
                }
                else {
                    resolve({ searchSuccess: true, Summoner: summoner })
                }
            })
    })
}

module.exports = { getSummoner }