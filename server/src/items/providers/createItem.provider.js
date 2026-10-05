const Item = require("../items.schema.js");
const { matchedData } = require("express-validator");
const { StatusCodes } = require("http-status-codes");
const logger = require("../../helpers/winston.helper.js");
const errorLogger = require("../../helpers/errorLogger.helper.js");

const {
  getTextEmbedding,
  getImageEmbedding,
} = require("../../services/ai.service.js");

async function createItemProvider(req, res) {
  console.log(req.user.sub);
  console.log(req.body);

  const validData = matchedData(req);

  try {
    // --------------------------------------------------
    // Extract data that needs special handling
    // --------------------------------------------------
    const {
      lat,
      lng,
      keywords,
      imageURL,
      ...rest
    } = validData;

    // --------------------------------------------------
    // Handle uploaded image
    // --------------------------------------------------
    const fullPath = req.file
      ? req.file.path
      : null;

    // Convert Windows "\" path separators to URL-friendly "/"
    const imagepath = fullPath
      ? fullPath
          .substring(fullPath.indexOf("uploads"))
          .replace(/\\/g, "/")
      : null;

    // --------------------------------------------------
    // Convert keywords into an array
    // --------------------------------------------------
    const processedKeywords = Array.isArray(keywords)
      ? keywords
      : keywords
      ? String(keywords)
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean)
      : [];

    // --------------------------------------------------
    // Build the item payload
    // --------------------------------------------------
    const payload = {
      ...rest,
      postedBy: req.user.sub,
      keywords: processedKeywords,

      // ----------------------------------------------
      // Map flat lat/lng → nested coordinates
      // ----------------------------------------------
      ...(lat &&
        lng && {
          coordinates: {
            lat: parseFloat(lat),
            lng: parseFloat(lng),
          },
        }),

      imageURL: imagepath,
    };

    // ==================================================
    // BUILD TEXT FOR AI MODEL
    // ==================================================
    const embeddingText = [
      payload.title,
      payload.description,
      payload.category,
      payload.location,
      ...(payload.keywords || []),
    ]
      .filter(Boolean)
      .join(". ");

    console.log();
    console.log("Generating AI text embedding...");
    console.log("Embedding text:");
    console.log(embeddingText);

    // ==================================================
    // GENERATE TEXT EMBEDDING
    // ==================================================
    const textEmbedding = await getTextEmbedding(
      embeddingText
    );

    console.log(
      "Text embedding generated successfully."
    );

    // ==================================================
    // SAVE TEXT EMBEDDING
    // ==================================================
    payload.textEmbedding = textEmbedding;

    // ==================================================
    // GENERATE IMAGE EMBEDDING
    // ==================================================
    if (fullPath) {
      console.log();
      console.log("Generating AI image embedding...");

      const imageEmbedding = await getImageEmbedding(
        fullPath
      );

      console.log(
        "Image embedding generated successfully."
      );

      // ----------------------------------------------
      // Save image embedding
      // ----------------------------------------------
      payload.imageEmbedding = imageEmbedding;
    } else {
      console.log(
        "No image uploaded. Skipping image embedding."
      );
    }

    // ==================================================
    // EMBEDDING VERSION
    // ==================================================
    payload.embeddingVersion = "v1";

    // ==================================================
    // CREATE AND SAVE ITEM
    // ==================================================
    const item = new Item(payload);

    await item.save();

    // ==================================================
    // LOG SUCCESSFUL CREATION
    // ==================================================
    logger.info(
      "Item created successfully",
      {
        userId: req.user.sub,
        itemId: item._id,
      }
    );

    // ==================================================
    // SEND RESPONSE
    // ==================================================
    return res
      .status(StatusCodes.CREATED)
      .json({
        message: "Item created successfully",
        data: item,
      });

  } catch (error) {
    console.log(error);

    errorLogger(
      "Error while creating item: ",
      req,
      error
    );

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({
        reason:
          "Unable to process your request at the moment, please try later.",
      });
  }
}

module.exports = createItemProvider;