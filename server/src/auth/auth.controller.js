const loginProvider = require("./providers/login.provider.js");

async function handlelogin(req, res) {
   return await loginProvider(req, res);
}

module.exports = {
    handlelogin,
};