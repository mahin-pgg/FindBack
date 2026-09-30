function cosineSimilarity(vectorA, vectorB) {

  // Make sure both vectors exist
  if (!Array.isArray(vectorA) || !Array.isArray(vectorB)) {
    return 0;
  }

  // Both vectors must have the same dimensions
  if (vectorA.length !== vectorB.length) {
    return 0;
  }

  if (vectorA.length === 0) {
    return 0;
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < vectorA.length; i++) {

    dotProduct += vectorA[i] * vectorB[i];

    magnitudeA += vectorA[i] * vectorA[i];

    magnitudeB += vectorB[i] * vectorB[i];
  }

  // Avoid division by zero
  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  const similarity =
    dotProduct /
    (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));

  return similarity;
}

module.exports = cosineSimilarity;