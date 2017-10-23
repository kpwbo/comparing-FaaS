const bcrypt = require("bcryptjs")
const SALT_ROUNDS = 13

const SALT = bcrypt.genSaltSync(SALT_ROUNDS)

exports.execute = function execute(req, res) {
  if (!req.body || !req.body.message) {
    res.status(400).send("No message received!")
  } else {
    const cipher = bcrypt.hashSync(req.body.message, SALT)
    res.status(200).send(cipher)
  }
}
