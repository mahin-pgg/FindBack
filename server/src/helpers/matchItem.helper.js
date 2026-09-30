const Item = require("../items/items.schema");

const cosineSimilarity = require("./semanticSimilarity.helper");


async function matchEngine(baseItem) {

  const oppositeType =
    baseItem.type === "lost"
      ? "found"
      : "lost";


  const candidates = await Item.find({
    type: oppositeType,
    category: baseItem.category,
    status: "approved",
    isActive: true,
  });


  const matches = [];


  for (const c of candidates) {

    let score = 0;

    let maximumPossibleScore = 0;

    const reasons = [];


    // ==========================================
    // 1. TEXT SEMANTIC SIMILARITY
    // Maximum: 40 points
    // ==========================================

    if (
      Array.isArray(baseItem.textEmbedding) &&
      Array.isArray(c.textEmbedding)
    ) {

      const textSimilarity =
        cosineSimilarity(
          baseItem.textEmbedding,
          c.textEmbedding
        );


      const textScore =
        Math.max(
          0,
          Math.min(
            40,
            textSimilarity * 40
          )
        );


      score += textScore;

      maximumPossibleScore += 40;


      if (textSimilarity >= 0.75) {

        reasons.push(
          "Strong text similarity"
        );

      }
      else if (textSimilarity >= 0.60) {

        reasons.push(
          "Moderate text similarity"
        );

      }


      console.log(
        "Text similarity:",
        textSimilarity
      );

    }


    // ==========================================
    // 2. IMAGE SIMILARITY
    // Maximum: 30 points
    // ==========================================

    if (
      Array.isArray(baseItem.imageEmbedding) &&
      Array.isArray(c.imageEmbedding)
    ) {

      const imageSimilarity =
        cosineSimilarity(
          baseItem.imageEmbedding,
          c.imageEmbedding
        );


      const imageScore =
        Math.max(
          0,
          Math.min(
            30,
            imageSimilarity * 30
          )
        );


      score += imageScore;

      maximumPossibleScore += 30;


      if (imageSimilarity >= 0.80) {

        reasons.push(
          "Strong visual similarity"
        );

      }
      else if (imageSimilarity >= 0.65) {

        reasons.push(
          "Moderate visual similarity"
        );

      }


      console.log(
        "Image similarity:",
        imageSimilarity
      );

    }
    else {

      console.log(
        "Image similarity skipped: image embedding missing"
      );

    }


    // ==========================================
    // 3. CATEGORY
    // Maximum: 15 points
    // ==========================================

    maximumPossibleScore += 15;


    if (
      baseItem.category ===
      c.category
    ) {

      score += 15;

      reasons.push(
        "Same category"
      );

    }


    // ==========================================
    // 4. LOCATION
    // Maximum: 10 points
    // ==========================================

    maximumPossibleScore += 10;


    if (
      baseItem.location ===
      c.location
    ) {

      score += 10;

      reasons.push(
        "Same location"
      );

    }


    // ==========================================
    // 5. KEYWORDS
    // Maximum: 3 points
    // ==========================================

    maximumPossibleScore += 3;


    const common =
      (baseItem.keywords || []).filter(
        (k) =>
          (c.keywords || []).includes(k)
      );


    if (common.length > 0) {

      const keywordScore =
        Math.min(
          common.length,
          3
        );


      score += keywordScore;


      reasons.push(
        `Keyword match (${common.length})`
      );

    }


    // ==========================================
    // 6. DATE
    // Maximum: 2 points
    // ==========================================

    maximumPossibleScore += 2;


    const diff =
      Math.abs(
        new Date(baseItem.date) -
        new Date(c.date)
      ) /
      (1000 * 60 * 60 * 24);


    if (diff <= 3) {

      score += 2;

      reasons.push(
        "Close date"
      );

    }


    // ==========================================
    // 7. NORMALIZE SCORE
    // ==========================================

    const normalizedScore =
      maximumPossibleScore > 0
        ? (score / maximumPossibleScore) * 100
        : 0;


    const finalScore =
      Math.max(
        0,
        Math.min(
          100,
          normalizedScore
        )
      );


    console.log(
      "Maximum possible score:",
      maximumPossibleScore
    );

    console.log(
      "Raw score:",
      score
    );

    console.log(
      "Final normalized score:",
      finalScore
    );


    // ==========================================
    // 8. MATCH THRESHOLD
    // ==========================================

    if (finalScore >= 50) {

      matches.push({

        lostItemId:
          baseItem.type === "lost"
            ? baseItem._id
            : c._id,


        foundItemId:
          baseItem.type === "found"
            ? baseItem._id
            : c._id,


        matchScore:
          Math.round(
            finalScore * 100
          ) / 100,


        matchReason:
          reasons.join(", "),

      });

    }

  }


  return matches;
}


module.exports = matchEngine;