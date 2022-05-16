const jwt = require("jsonwebtoken");
// Verify the token is match or valied or not with the help of secret key
const authToken = (token) => {
  let tokenValidate = jwt.verify(token, "project-3-group-13", (err, data) => {
    if (err) return null;
    else {
      return data;
    }
  });
  return tokenValidate;
};

const validateToken = async function (req, res, next) {
  try {
    // token came from response Hader
    let token = req.headers["x-Api-Key"] || req.headers["x-api-key"];
    // if the token present or not in response header
    if (!token) {
      return res
        .status(401)
        .send({ status: false, msg: "token must be present" });
    }
    // we save this token with variable because decoded userId in then Token
    let decodedToken = authToken(token);
    if (!decodedToken) {
      return res.status(401).send({ status: false, msg: "inavlid token" });
    }
    console.log(decodedToken);
    // we create the  userId with the help of decodedToken and set in request userId
    req["userId"] = decodedToken.userId;
    console.log(req["authorId"]);
    // next function go to the next handler
    next();
  } catch (erre) {
    return res.status(500).send({ status: "Error", error: erre.message });
  }
};
module.exports.validateToken = validateToken;
