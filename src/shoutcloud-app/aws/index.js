/// Adapted from:
/// https://github.com/SHOUTCLOUD/SHOUTCLOUD_NODE/blob/master/SHOUTCLOUD.js

const http = require("http")

const SHOUTCLOUD = {
  /** @return {Promise<string>} `inputString` converted to upper case. */
  UPCASE(inputString) {
    const postData = JSON.stringify({
      INPUT: inputString
    })

    const postOptions = {
      hostname: "API.SHOUTCLOUD.IO",
      path: "/V1/SHOUT",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    }

    return new Promise((resolve, reject) => {
      const postReq = http.request(postOptions, response => {
        response.on("data", chunk => {
          const json = JSON.parse(chunk)
          resolve(json.OUTPUT)
        })
      })
      postReq.on("error", err => {
        reject(err)
      })
      postReq.write(postData)
      postReq.end()
    })
  }
}

exports.handler = (event, context, callback) => {
  const params = event.body && JSON.parse(event.body)

  if (!params || !params.message) {
    callback(null, {
      statusCode: "400",
      body: "No message received!",
      headers: {
        "Content-Type": "text/plain"
      }
    })
  } else {
    SHOUTCLOUD.UPCASE(params.message).then(upper => {
      callback(null, {
        statusCode: "200",
        body: upper,
        headers: {
          "Content-Type": "text/plain"
        }
      })
    }).catch(err => {
      callback(null, {
        statusCode: "500",
        body: err.message,
        headers: {
          "Content-Type": "text/plain"
        }
      })
    })
  }
}
