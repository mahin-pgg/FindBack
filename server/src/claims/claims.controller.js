const createClaimProvider = require("./providers/createClaim.provider")
const getMyClaimsProvider = require("./providers/getMyClaims.provider")
const approveClaimProvider = require("./providers/approveClaim.provider")
const rejectClaimProvider = require("./providers/rejectClaim.provider")

async function handleCreateClaim(req ,res){

    return await createClaimProvider(req ,res);

}

async function handleGetMyClaims(req ,res){

    return await getMyClaimsProvider(req ,res);

}

async function handleApproveClaim(req ,res){

    return await approveClaimProvider(req ,res);

}

async function handleRejectClaim(req ,res){

    return await rejectClaimProvider(req ,res);

}

module.exports = {
    handleCreateClaim ,
    handleApproveClaim,
    handleRejectClaim,
    handleGetMyClaims
}