const createUserProvider= require("./providers/createuser.provider.js");
const blockUserProvider = require("./providers/blockUser.provider.js");
const userDashboardProvider = require("./providers/userDashboard.provider.js");
const getProfileProvider     = require("./providers/getProfile.provider.js");
const updateProfileProvider  = require("./providers/updateProfile.provider.js");
const updatePasswordProvider = require("./providers/updatePassword.provider.js");

async function handleCreateUser(req, res) {
    return await createUserProvider(req, res);
}

async function handleBlockUser(req, res) {
    return await blockUserProvider(req, res);
}

async function handleUserDashboard(req, res) {
    return await userDashboardProvider(req, res);
}

async function handleGetProfile(req, res) {
    return await getProfileProvider(req, res);
}
async function handleUpdateProfile(req, res) {
    return await updateProfileProvider(req, res);
}
async function handleUpdatePassword(req, res) {
    return await updatePasswordProvider(req, res);
}

module.exports = {
    handleCreateUser,
    handleBlockUser,
    handleUserDashboard,
    handleGetProfile,
    handleUpdateProfile,
    handleUpdatePassword,
};