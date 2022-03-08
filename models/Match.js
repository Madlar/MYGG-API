const mongoose = require('mongoose')
//정의 순서 중요 제일 작은 커스텀 스키마부터 정의해나갈것
const objective = mongoose.Schema({
    first: Boolean,
    kills: Number
},{ _id : false })

const objectives = mongoose.Schema({
    baron: objective,
    champion: objective,
    dragon: objective,
    inhibitor: objective,
    riftHerald: objective,
    tower: objective,
},{ _id : false })

const ban = mongoose.Schema({
    championId: Number,
    pickTurn: Number
},{ _id : false })

const team = mongoose.Schema({
    bans: [ban],
    objectives: objectives,
    teamId: Number,
    win: Boolean
},{ _id : false })

const perkStyleSelection = mongoose.Schema({
    perk: Number,
    var1: Number,
    var2: Number,
    var3: Number
},{ _id : false })

const perkStyle = mongoose.Schema({
    description: String,
    selections: [perkStyleSelection],
    style: Number
},{ _id : false })

const perkStats = mongoose.Schema({
    defense: Number,
    flex: Number,
    offense: Number
},{ _id : false })

const perks = mongoose.Schema({
    statPerks: perkStats,
    styles: [perkStyle]
},{ _id : false })

const participants = mongoose.Schema({
    assists: Number,
    baronKills: Number,
    bountyLevel: Number,
    champExperience: Number,
    champLevel: Number,
    championId: Number,//Prior to patch 11.4, on Feb 18th, 2021, this field returned invalid championIds. We recommend determining the champion based on the championName field for matches played prior to patch 11.4.
    championName: String,
    championTransform: Number,//	This field is currently only utilized for Kayn's transformations. (Legal values: 0 - None, 1 - Slayer, 2 - Assassin)
    consumablesPurchased: Number,
    damageDealtToBuildings: Number,
    damageDealtToObjectives: Number,
    damageDealtToTurrets: Number,
    damageSelfMitigated: Number,
    deaths: Number,
    detectorWardsPlaced: Number,
    doubleKills: Number,
    dragonKills: Number,
    firstBloodAssist: Boolean,
    firstBloodKill: Boolean,
    firstTowerAssist: Boolean,
    firstTowerKill: Boolean,
    gameEndedInEarlySurrender: Boolean,
    gameEndedInSurrender: Boolean,
    goldEarned: Number,
    goldSpent: Number,
    individualPosition: String,//Both individualPosition and teamPosition are computed by the game server and are different versions of the most likely position played by a player. The individualPosition is the best guess for which position the player actually played in isolation of anything else. The teamPosition is the best guess for which position the player actually played if we add the constraint that each team must have one top player, one jungle, one middle, etc. Generally the recommendation is to use the teamPosition field over the individualPosition field.
    inhibitorKills: Number,
    inhibitorTakedowns: Number,
    inhibitorsLost: Number,
    item0: Number,
    item1: Number,
    item2: Number,
    item3: Number,
    item4: Number,
    item5: Number,
    item6: Number,
    itemsPurchased: Number,
    killingSprees: Number,
    kills: Number,
    lane: String,
    largestCriticalStrike: Number,
    largestKillingSpree: Number,
    largestMultiKill: Number,
    longestTimeSpentLiving: Number,
    magicDamageDealt: Number,
    magicDamageDealtToChampions: Number,
    magicDamageTaken: Number,
    neutralMinionsKilled: Number,
    nexusKills: Number,
    nexusTakedowns: Number,
    nexusLost: Number,
    objectivesStolen: Number,
    objectivesStolenAssists: Number,
    participantId: Number,
    pentaKills: Number,
    perks: perks,
    physicalDamageDealt: Number,
    physicalDamageDealtToChampions: Number,
    physicalDamageTaken: Number,
    profileIcon: Number,
    puuid: String,
    quadraKills: Number,
    riotIdName: String,
    riotIdTagline: String,
    role: String,
    sightWardsBoughtInGame: Number,
    spell1Casts: Number,
    spell2Casts: Number,
    spell3Casts: Number,
    spell4Casts: Number,
    summoner1Casts: Number,
    summoner1Id: Number,
    summoner2Casts: Number,
    summoner2Id: Number,
    summonerId: String,
    summonerLevel: Number,
    summonerName: String,
    teamEarlySurrendered: Boolean,
    teamId: Number,
    teamPosition: String,//Both individualPosition and teamPosition are computed by the game server and are different versions of the most likely position played by a player. The individualPosition is the best guess for which position the player actually played in isolation of anything else. The teamPosition is the best guess for which position the player actually played if we add the constraint that each team must have one top player, one jungle, one middle, etc. Generally the recommendation is to use the teamPosition field over the individualPosition field.
    timeCCingOthers: Number,
    timePlayed: Number,
    totalDamageDealt: Number,
    totalDamageDealtToChampions: Number,
    totalDamageShieldedOnTeammates: Number,
    totalDamageTaken: Number,
    totalHeal: Number,
    totalHealsOnTeammates: Number,
    totalMinionsKilled: Number,
    totalTimeCCDealt: Number,
    totalTimeSpentDead: Number,
    totalUnitsHealed: Number,
    tripleKills: Number,
    trueDamageDealt: Number,
    trueDamageDealtToChampions: Number,
    trueDamageTaken: Number,
    turretKills: Number,
    turretTakedowns: Number,
    turretsLost: Number,
    unrealKills: Number,
    visionScore: Number,
    visionWardsBoughtInGame: Number,
    wardsKilled: Number,
    wardsPlaced: Number,
    win: Boolean
},{ _id : false })

const info = mongoose.Schema({
    gameCreation: Number,//Unix timestamp for when the game is created on the game server (i.e., the loading screen).
    gameDuration: Number,//Prior to patch 11.20, this field returns the game length in milliseconds calculated from gameEndTimestamp - gameStartTimestamp. Post patch 11.20, this field returns the max timePlayed of any participant in the game in seconds, which makes the behavior of this field consistent with that of match-v4. The best way to handling the change in this field is to treat the value as milliseconds if the gameEndTimestamp field isn't in the response and to treat the value as seconds if gameEndTimestamp is in the response.
    gameEndTimestamp: Number,//	Unix timestamp for when match ends on the game server. This timestamp can occasionally be significantly longer than when the match "ends". The most reliable way of determining the timestamp for the end of the match would be to add the max time played of any participant to the gameStartTimestamp. This field was added to match-v5 in patch 11.20 on Oct 5th, 2021.
    gameId: Number,
    gameMode: String,//	Refer to the Game Constants documentation.
    gameName: String,
    gameStartTimestamp: Number,//Unix timestamp for when match starts on the game server.
    gameType: String,
    gameVersion: String,//The first two parts can be used to determine the patch a game was played on.
    mapId: Number,//	Refer to the Game Constants documentation.
    participants: [participants],
    platformId: String,//Platform where the match was played.
    queueId: Number,//	Refer to the Game Constants documentation.
    teams: [team],
    tournamentCode: String,//Tournament code used to generate the match. This field was added to match-v5 in patch 11.13 on June 23rd, 2021.
},{ _id : false })

const metadata = mongoose.Schema({
    dataVersion: String,//Match data version.
    matchId: String,//Match id.
    participants: [String]//A list of participant PUUIDs.
},{ _id : false })

const matchSchema = mongoose.Schema({
    metadata: metadata, //Match metadata.
    info: info //	Match info.
})

const Match = mongoose.model('Match', matchSchema)

module.exports = { Match }