/// <reference types="vitest/globals" />

import { getCheapestInterval } from "./interval";

describe("getCheapestInterval", () => {
  describe("basic functionality", () => {
    it("should find the cheapest interval in the example case", () => {
      const result = getCheapestInterval({
        prices: [
          { time: 0, price: 10 },
          { time: 1, price: 5 },
          { time: 2, price: 2 },
          { time: 3, price: 8 },
          { time: 4, price: 10 },
        ],
        currentTimeMs: 0,
        timeStepWidthMs: 1,
        durationMs: 3,
      });

      expect(result.cheapestStartTimeIndex).toBe(1);
      expect(result.startTime).toBe(1);
      expect(result.price).toBe(15); // 5 + 2 + 8
    });

    it("should find cheapest interval at the beginning", () => {
      const result = getCheapestInterval({
        prices: [
          { time: 0, price: 1 },
          { time: 1, price: 2 },
          { time: 2, price: 3 },
          { time: 3, price: 10 },
        ],
        currentTimeMs: 0,
        timeStepWidthMs: 1,
        durationMs: 2,
      });

      expect(result.startTime).toBe(0);
      expect(result.price).toBe(3); // 1 + 2
    });

    it("should find cheapest interval at the end", () => {
      const result = getCheapestInterval({
        prices: [
          { time: 0, price: 10 },
          { time: 1, price: 10 },
          { time: 2, price: 1 },
          { time: 3, price: 2 },
        ],
        currentTimeMs: 0,
        timeStepWidthMs: 1,
        durationMs: 2,
      });

      expect(result.startTime).toBe(2);
      expect(result.price).toBe(3); // 1 + 2
    });
  });

  describe("current time handling", () => {
    it("should only consider prices from current time onwards", () => {
      const result = getCheapestInterval({
        prices: [
          { time: 0, price: 1 },
          { time: 1, price: 2 },
          { time: 2, price: 100 },
          { time: 3, price: 1 },
          { time: 4, price: 1 },
        ],
        currentTimeMs: 2,
        timeStepWidthMs: 1,
        durationMs: 2,
      });

      expect(result.startTime).toBe(3);
      expect(result.price).toBe(2); // 1 + 1
    });

    it("should handle current time exactly at a price point", () => {
      const result = getCheapestInterval({
        prices: [
          { time: 100, price: 5 },
          { time: 101, price: 3 },
          { time: 102, price: 4 },
        ],
        currentTimeMs: 101,
        timeStepWidthMs: 1,
        durationMs: 2,
      });

      expect(result.startTime).toBe(101);
      expect(result.price).toBe(7); // 3 + 4
    });
  });

  describe("duration handling", () => {
    it("should handle single step duration", () => {
      const result = getCheapestInterval({
        prices: [
          { time: 0, price: 10 },
          { time: 1, price: 5 },
          { time: 2, price: 3 },
        ],
        currentTimeMs: 0,
        timeStepWidthMs: 1,
        durationMs: 1,
      });

      expect(result.startTime).toBe(2);
      expect(result.price).toBe(3);
    });

    it("should handle multi-step duration with time step width", () => {
      const result = getCheapestInterval({
        prices: [
          { time: 0, price: 10 },
          { time: 5, price: 5 },
          { time: 10, price: 2 },
          { time: 15, price: 8 },
          { time: 20, price: 10 },
        ],
        currentTimeMs: 0,
        timeStepWidthMs: 5,
        durationMs: 15, // 3 steps
      });

      expect(result.startTime).toBe(5);
      expect(result.price).toBe(15); // 5 + 2 + 8
    });
  });

  describe("error cases", () => {
    it("should throw when no future prices available", () => {
      expect(() =>
        getCheapestInterval({
          prices: [
            { time: 0, price: 10 },
            { time: 1, price: 5 },
          ],
          currentTimeMs: 5,
          timeStepWidthMs: 1,
          durationMs: 2,
        })
      ).toThrow(
        "Not enough data to predict future prices for job with duration"
      );
    });

    it("should throw when duration exceeds available price data", () => {
      expect(() =>
        getCheapestInterval({
          prices: [
            { time: 0, price: 10 },
            { time: 1, price: 5 },
          ],
          currentTimeMs: 0,
          timeStepWidthMs: 1,
          durationMs: 10,
        })
      ).toThrow(
        "Not enough data to predict future prices for job with duration"
      );
    });

    it("should throw when attempting to start job too late for completion", () => {
      expect(() => {
        getCheapestInterval({
          prices: [
            { time: 0, price: 10 },
            { time: 1, price: 5 },
            { time: 2, price: 3 },
          ],
          currentTimeMs: 0,
          timeStepWidthMs: 1,
          durationMs: 4,
        });
      }).toThrow();
    });
  });

  describe("price patterns", () => {
    it("should handle flat prices", () => {
      const result = getCheapestInterval({
        prices: [
          { time: 0, price: 5 },
          { time: 1, price: 5 },
          { time: 2, price: 5 },
          { time: 3, price: 5 },
        ],
        currentTimeMs: 0,
        timeStepWidthMs: 1,
        durationMs: 2,
      });

      expect(result.price).toBe(10); // 5 + 5
      expect(result.cheapestStartTimeIndex).toBe(0); // First valid index
    });

    it("should handle ascending prices", () => {
      const result = getCheapestInterval({
        prices: [
          { time: 0, price: 1 },
          { time: 1, price: 2 },
          { time: 2, price: 3 },
          { time: 3, price: 4 },
          { time: 4, price: 5 },
        ],
        currentTimeMs: 0,
        timeStepWidthMs: 1,
        durationMs: 2,
      });

      expect(result.startTime).toBe(0);
      expect(result.price).toBe(3); // 1 + 2
    });

    it("should handle descending prices", () => {
      const result = getCheapestInterval({
        prices: [
          { time: 0, price: 5 },
          { time: 1, price: 4 },
          { time: 2, price: 3 },
          { time: 3, price: 2 },
          { time: 4, price: 1 },
        ],
        currentTimeMs: 0,
        timeStepWidthMs: 1,
        durationMs: 2,
      });

      expect(result.startTime).toBe(3);
      expect(result.price).toBe(3); // 2 + 1
    });

    it("should handle multiple price dips", () => {
      const result = getCheapestInterval({
        prices: [
          { time: 0, price: 10 },
          { time: 1, price: 2 },
          { time: 2, price: 3 },
          { time: 3, price: 10 },
          { time: 4, price: 1 },
          { time: 5, price: 1 },
          { time: 6, price: 10 },
        ],
        currentTimeMs: 0,
        timeStepWidthMs: 1,
        durationMs: 2,
      });

      expect(result.startTime).toBe(4);
      expect(result.price).toBe(2); // 1 + 1 (cheaper than 2 + 3)
    });
  });

  describe("edge cases with large numbers", () => {
    it("should handle large time values", () => {
      const result = getCheapestInterval({
        prices: [
          { time: 1000000, price: 10 },
          { time: 1000001, price: 5 },
          { time: 1000002, price: 2 },
          { time: 1000003, price: 8 },
        ],
        currentTimeMs: 1000000,
        timeStepWidthMs: 1,
        durationMs: 2,
      });

      expect(result.startTime).toBe(1000001);
      expect(result.price).toBe(7); // 5 + 2
    });

    it("should handle various time step widths", () => {
      const result = getCheapestInterval({
        prices: [
          { time: 0, price: 10 },
          { time: 30, price: 5 },
          { time: 60, price: 2 },
          { time: 90, price: 8 },
        ],
        currentTimeMs: 0,
        timeStepWidthMs: 30,
        durationMs: 60, // 2 steps
      });

      expect(result.startTime).toBe(30);
      expect(result.price).toBe(7); // 5 + 2
    });
  });
});
