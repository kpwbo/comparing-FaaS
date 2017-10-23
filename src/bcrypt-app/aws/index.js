const bcrypt = require("bcryptjs")
const SALT_ROUNDS = 13

const SALT = bcrypt.genSaltSync(SALT_ROUNDS)

exports.handler = (event, context, callback) => {
  const params = event.body && JSON.parse(event.body)
  let response

  if (!params || !params.message) {
    response = {
      statusCode: "400",
      body: "No message received!",
      headers: {
        "Content-Type": "text/plain"
      }
    }
  } else {
    const cipher = bcrypt.hashSync(params.message, SALT)
    response = {
      statusCode: "200",
      body: cipher,
      headers: {
        "Content-Type": "text/plain"
      }
    }
  }
    
  callback(null, response)
}
