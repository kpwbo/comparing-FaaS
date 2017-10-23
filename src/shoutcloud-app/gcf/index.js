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

exports.execute = function(req, res) {
  if (!req.body || !req.body.message) {
    res.status(400).send("No message received!") 
  } else {
    SHOUTCLOUD.UPCASE(req.body.message).then((result) => {
      res.status(200).send(result)
    }).catch((error) => {
      res.status(500).send(error.message)
    })
  }
}
