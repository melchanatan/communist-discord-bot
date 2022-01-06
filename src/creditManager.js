const admin = require("firebase-admin")

const serviceAccount = require("../firebase-config.json")

const firebaseConfig = {
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://communist-discord-bot-337007-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

try {
    admin.initializeApp(firebaseConfig)
} catch (e) { console.log(e) }

const db = admin.database();
const ref = db.ref("members");

let guildDb
const connectFirebase = (guildId) => {
    guildDb = ref.child(String(guildId))
}

const updateCredit = (userId, credit) => {
    if (!guildDb) return 0
    guildDb.child(String(userId)).set({
        name: String(userId.author.username),
        Credit: credit
    })
    return 1
}

const fetchCredit = async (userId) => {
    if (!guildDb) return 0
    guildDb.child(String(userId)).child("Credit").once("value", function(snapshot) {
        if (snapshot.val() != null) userId.reply(String(snapshot.val()))
    })
    return 1
}

module.exports = {updateCredit, fetchCredit, connectFirebase}