import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  calculateSM2,
  answerToQuality,
  getReviewRecommendation,
  calculateRetention,
  getDifficultyLabel,
  formatInterval,
} from "./spaced-repetition";

describe("Spaced Repetition - SM2 Algorithm", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-15"));
  });

  describe("calculateSM2", () => {
    it("should reset interval when quality < 3 (failed recall)", () => {
      const result = calculateSM2({
        quality: 2,
        easeFactor: 2.5,
        interval: 10,
        repetitions: 3,
      });

      expect(result.interval).toBe(1);
      expect(result.repetitions).toBe(0);
      expect(result.easeFactor).toBeLessThanOrEqual(2.5);
    });

    it("should set interval to 1 day for first successful review", () => {
      const result = calculateSM2({
        quality: 4,
        easeFactor: 2.5,
        interval: 0,
        repetitions: 0,
      });

      expect(result.interval).toBeGreaterThanOrEqual(1);
      expect(result.repetitions).toBe(1);
    });

    it("should set interval to ~6 days for second successful review", () => {
      const result = calculateSM2({
        quality: 4,
        easeFactor: 2.5,
        interval: 1,
        repetitions: 1,
      });

      // With fuzz factor, interval should be around 6
      expect(result.interval).toBeGreaterThanOrEqual(5);
      expect(result.interval).toBeLessThanOrEqual(7);
      expect(result.repetitions).toBe(2);
    });

    it("should increase ease factor for perfect recall (quality 5)", () => {
      const initialEaseFactor = 2.5;
      const result = calculateSM2({
        quality: 5,
        easeFactor: initialEaseFactor,
        interval: 6,
        repetitions: 2,
      });

      expect(result.easeFactor).toBeGreaterThan(initialEaseFactor);
    });

    it("should not let ease factor drop below 1.3", () => {
      const result = calculateSM2({
        quality: 0,
        easeFactor: 1.3,
        interval: 10,
        repetitions: 5,
      });

      expect(result.easeFactor).toBeGreaterThanOrEqual(1.3);
    });

    it("should return a nextReviewDate in the future", () => {
      const result = calculateSM2({
        quality: 4,
        easeFactor: 2.5,
        interval: 10,
        repetitions: 3,
      });

      expect(result.nextReviewDate.getTime()).toBeGreaterThan(
        new Date().getTime()
      );
    });
  });

  describe("answerToQuality", () => {
    it("should return 0 for confident but wrong answer", () => {
      const quality = answerToQuality(false, 30, 30, "high");
      expect(quality).toBe(0);
    });

    it("should return 1 for regular wrong answer", () => {
      const quality = answerToQuality(false, 30, 30);
      expect(quality).toBe(1);
    });

    it("should return 3 for slow correct answer", () => {
      const quality = answerToQuality(true, 90, 30); // 3x expected time
      expect(quality).toBe(3);
    });

    it("should return 5 for fast correct answer with high confidence", () => {
      const quality = answerToQuality(true, 15, 30, "high"); // 0.5x expected time
      expect(quality).toBe(5);
    });

    it("should return 4 for fast correct answer without confidence", () => {
      const quality = answerToQuality(true, 15, 30);
      expect(quality).toBe(4);
    });
  });

  describe("getReviewRecommendation", () => {
    it("should return all due cards if under daily limit", () => {
      const result = getReviewRecommendation(30, 50, 20);
      expect(result.reviewCount).toBe(30);
      expect(result.newCount).toBe(20);
    });

    it("should cap review count at daily limit", () => {
      const result = getReviewRecommendation(100, 50, 20);
      expect(result.reviewCount).toBe(50);
    });

    it("should show appropriate message when no cards due", () => {
      const result = getReviewRecommendation(0, 50, 20);
      expect(result.reviewCount).toBe(0);
      expect(result.message).toContain("복습할 카드가 없습니다");
    });
  });

  describe("calculateRetention", () => {
    it("should return high retention for recent review", () => {
      const retention = calculateRetention(2.5, 0, 10);
      expect(retention).toBeCloseTo(100, 0);
    });

    it("should return lower retention as days increase", () => {
      const recentRetention = calculateRetention(2.5, 5, 10);
      const olderRetention = calculateRetention(2.5, 20, 10);
      expect(recentRetention).toBeGreaterThan(olderRetention);
    });

    it("should return retention between 0 and 100", () => {
      const retention = calculateRetention(2.5, 1000, 10);
      expect(retention).toBeGreaterThanOrEqual(0);
      expect(retention).toBeLessThanOrEqual(100);
    });
  });

  describe("getDifficultyLabel", () => {
    it("should return '쉬움' for high ease factor", () => {
      const result = getDifficultyLabel(2.7);
      expect(result.label).toBe("쉬움");
      expect(result.color).toBe("green");
    });

    it("should return '보통' for medium ease factor", () => {
      const result = getDifficultyLabel(2.2);
      expect(result.label).toBe("보통");
      expect(result.color).toBe("yellow");
    });

    it("should return '어려움' for low ease factor", () => {
      const result = getDifficultyLabel(1.7);
      expect(result.label).toBe("어려움");
      expect(result.color).toBe("orange");
    });

    it("should return '매우 어려움' for very low ease factor", () => {
      const result = getDifficultyLabel(1.3);
      expect(result.label).toBe("매우 어려움");
      expect(result.color).toBe("red");
    });
  });

  describe("formatInterval", () => {
    it("should format 0 days as '오늘'", () => {
      expect(formatInterval(0)).toBe("오늘");
    });

    it("should format 1 day as '내일'", () => {
      expect(formatInterval(1)).toBe("내일");
    });

    it("should format days less than 7 correctly", () => {
      expect(formatInterval(3)).toBe("3일 후");
    });

    it("should format weeks correctly", () => {
      expect(formatInterval(14)).toBe("2주 후");
    });

    it("should format months correctly", () => {
      expect(formatInterval(60)).toBe("2개월 후");
    });

    it("should format years correctly", () => {
      expect(formatInterval(400)).toBe("1년 후");
    });
  });
});
