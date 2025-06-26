const express=require("express")
const Auth=require("../middlewares/auth")
const profileRouter=express.Router()


profileRouter.get("/profile", Auth, (req, res) => {
  try {
    const user = req.user;

    res.send(`Hello ${user.firstName}`);
  } catch (error) {}
});


module.exports = profileRouter;