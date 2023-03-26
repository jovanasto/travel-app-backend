const monk = require('monk')

const db = monk(`${process.env.MONGODB_ROOT_USERNAME}:${process.env.MONGODB_ROOT_PASSWORD}@${process.env.MONGODB_URL}:27017/auth-forNoobs`,{authSource:'admin'})

db.then(() => {
    console.log('Connected correctly to server')
  })

module.exports = db