export function getCheapestInterval({
  prices,
  currentTimeMs: currentTime,
  timeStepWidthMs,
  durationMs,
}: {
  prices: { time: number; price: number }[];
  timeStepWidthMs: number;
  currentTimeMs: number;
  durationMs: number;
}) {
  // Find next index where .time >= current time
  const nextPriceIntervalIndex = prices.findIndex(
    (item) => item.time >= currentTime
  );

  if (nextPriceIntervalIndex === -1) {
    throw new Error(
      `Not enough data to predict future prices for job with duration ${durationMs.toLocaleString()}`
    );
  }

  console.debug({ nextPriceIntervalIndex });

  // Only consider prices from the future
  prices = prices.slice(nextPriceIntervalIndex);

  console.debug({ length: prices.length });
  // How many indices is needed to complete job?
  const durationInSteps = durationMs / timeStepWidthMs;

  if (durationInSteps > prices.length) {
    throw new Error(
      `Not enough data to predict future prices for job with duration ${durationMs.toLocaleString()}`
    );
  }

  let cheapestStartTimeIndex = 0;
  let cheapestPrice = Infinity;

  if (durationInSteps > prices.length) {
    throw new Error(
      `Not enough data to predict future prices for job with duration ${durationMs.toLocaleString()}`
    );
  }

  for (let i = 0; i < prices.length; i++) {

    if (i + durationInSteps > prices.length) {
      // We need to be able to run the job in the given duration in the known price charts, so we wont start it in the future
      break;
    }

    const priceForInterval = calculatePriceForInterval(
      i,
      durationInSteps,
      prices
    );

    if (priceForInterval < cheapestPrice) {
      cheapestPrice = priceForInterval;
      cheapestStartTimeIndex = i;
    }
  }

  if (cheapestPrice === Infinity) {
    throw new Error(
      `Not enough data to predict future prices for job with duration ${durationMs.toLocaleString()}`
    );
  }

  return {
    cheapestStartTimeIndex,
    startTime: prices[cheapestStartTimeIndex].time,
    price: cheapestPrice,
  };
}

function calculatePriceForInterval(
  startIndex: number,
  intervalWidth: number,
  prices: { price: number, [key: string]: unknown }[]
) {

  const endIndex = startIndex + intervalWidth;
  if (endIndex > prices.length) {
    throw new Error("Interval overflow, attempting to calculate prices out of range")
  }
  return prices.slice(startIndex, endIndex).reduce((a, b) => a + b.price, 0);
}
