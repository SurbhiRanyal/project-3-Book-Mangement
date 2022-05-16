const jwt = require("jsonwebtoken");
const userModel = require("../model/userModel");

const loginUser = async function (req, res) {
  try {
    if (!Object.keys(req.body).length === 0)
      return res
        .status(400)
        .send({ status: false, msg: "Please enter  mail and password" });
    let userName = req.body.email;
    let password = req.body.password;
    // userName Validation
    if (!userName || userName === undefined) {
      return res.status(400).send({ status: false, msg: "please enter email" });
    }
    // Password Validation
    if (!password || password === undefined) {
      return res
        .status(400)
        .send({ status: false, msg: "please enter password" });
    }
    userName = userName.trim().toLowerCase();
    password = password.trim();
    // Find userName and Password present in DV or not
    let user = await userModel.findOne({ email: userName, password: password });
    if (!user)
      return res
        .status(404)
        .send({
          status: false,
          msg: "Please enter a valid email address and password",
        });
    // Creating token Under Using userId with secret Key
    let token = jwt.sign(
      {
        userId: user._id.toString(),
        group: "13",
        project: 3,
      },
      "project-3-group-13",
      { expiresIn: "3600s" }
    );

    // Set This token In response in Header and Also In body
    res.setHeader("x-api-key", token);
    return res.status(200).send({ status: true, data: token });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send({ status: "error", msg: err.message });
  }
};

module.exports.loginUser = loginUser;
