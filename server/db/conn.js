const { MongoClient } = require('mongodb')
const Db = process.env.ATLAS_URI
const client = new MongoClient(Db, {
    useNewURLParser: true,
    useUnifiedTopology: true,
})

var _db

module.exports = {
    connectToServer: function(callback) {
        client.connect(function(err, db) {
            // verify we have a good db obj
            if (db) {
                _db = db.db('users') // make users table
                console.log('Successfully connected to mongodb')
            }
            return callback(err)
        })
    },

    getDb: function() {
        return _db
    }
}