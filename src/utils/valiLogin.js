const valiLogin = (user) => {
  const {  emailId, password } = user;

  if (!emailId || !password) {
    throw new Error("Please provide email and password");
  }
};

module.exports = valiLogin;
