const verifyItemProvider = require('./providers/verifyItem.provider');
const adminDashboardProvider = require('./providers/adminDashboard.provider');
const getUsersProvider = require('./providers/getUsers.provider');
const analyticsOverviewProvider = require('./providers/analyticsOverview.provider');
const getClaimsProvider = require("./providers/getClaims.provider");


async function handleVerifyItem(req, res) {
    return await verifyItemProvider(req, res);
}

async function handleAdminDashboard(req, res) {
    return await adminDashboardProvider(req, res);
}

async function handleGetUsers(req, res) {
    return await getUsersProvider(req, res);
}

async function handleAnalyticsOverview(req, res) {
  return await analyticsOverviewProvider(req, res);
}

async function handleGetClaims(req ,res){
    return await getClaimsProvider(req ,res);

}

module.exports = {
    handleVerifyItem,
    handleAdminDashboard,
    handleGetUsers,
    handleAnalyticsOverview,
    handleGetClaims,
};