const valiLogin = (req) => {

  console.log(req.cookies);

  if(req.cookies.token){
    throw new Error("Please logout")
  }
  
  const {  emailId, password } = req.body;



  if (!emailId || !password) {
    throw new Error("Please provide email and password");
  }
};

module.exports = valiLogin;
