const { json } = require('micro')
const cors = require('micro-cors')()
const aes = require('browserify-aes')
const users = require('./users.json')

const algorithm = 'aes-256-ctr'
const password = process.env.UPAUTH_KEY || '4e82296c77cadbbb'

function encrypt (text) {
  var cipher = aes.createCipher(algorithm, password)
  var crypted = cipher.update(text, 'utf8', 'hex')
  crypted += cipher.final('hex')
  return crypted
}

// function decrypt (text) {
//   var decipher = aes.createDecipher(algorithm, password)
//   var dec = decipher.update(text, 'hex', 'utf8')
//   dec += decipher.final('utf8')
//   return dec
// }

module.exports = cors(async (req, res) => {
  const { username, password } = await json(req)
  if (username && password) {
    if (users[username] === password) {
      return { token: encrypt(username) }
    } else {
      return { error: 'Wrong username or password' }
    }
  } else {
    return { error: 'Require username & password' }
  }
})
