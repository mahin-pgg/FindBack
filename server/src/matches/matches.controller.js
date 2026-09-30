const { StatusCodes } = require("http-status-codes");

const runMatchProvider = require("./providers/runMatch.provider");
const getMyMatchesProvider = require("./providers/getMyMatches.provider");
const acceptMatchProvider = require("./providers/acceptMatch.provider");
const rejectMatchProvider = require("./providers/rejectMatch.provider");

async function handleRunMatch(req, res) {

  try {

    const matches = await runMatchProvider(
      req.params.itemId
    );

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Matches generated successfully",
      data: matches,
    });

  } catch (error) {

    console.log(error);

    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: error.message,
    });
  }
}

async function handleGetMyMatches(req, res) {
  try {
    const matches = await getMyMatchesProvider(
      req.user.sub,
      req.query
    );

    return res.status(200).json(matches);

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to fetch matches",
    });
  }
}

async function handleAcceptMatch(req, res) {

  try {

    const match = await acceptMatchProvider(
      req.params.id,
      req.user.sub
    );

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Match accepted",
      data: match,
    });

  } catch (error) {

    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: error.message,
    });
  }
}

async function handleRejectMatch(req, res) {

  try {

    const match = await rejectMatchProvider(
      req.params.id,
      req.user.sub
    );

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Match rejected",
      data: match,
    });

  } catch (error) {

    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  handleRunMatch,
  handleGetMyMatches,
  handleAcceptMatch,
  handleRejectMatch,
};