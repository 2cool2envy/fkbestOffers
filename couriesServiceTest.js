const {
  calculateBaseCost,
  calculateDiscount,
  calculateTotalCost,
  estimateDeliveryTimes,
} = require("./courierService");

describe("Courier Service Core Logic", () => {
  test("Base delivery cost is computed correctly", () => {
    expect(calculateBaseCost(100, 10, 20)).toBe(100 + 10 * 10 + 20 * 5);
  });

  test("OFR001 discount applies correctly", () => {
    const pkg = { weight: 100, distance: 150, offerCode: "OFR001" };
    const cost = calculateBaseCost(100, pkg.weight, pkg.distance);
    const discount = calculateDiscount(pkg, cost);
    expect(discount).toBeCloseTo(cost * 0.1, 2);
  });

  test("Invalid offer gives zero discount", () => {
    const pkg = { weight: 50, distance: 300, offerCode: "OFR001" };
    const cost = calculateBaseCost(100, pkg.weight, pkg.distance);
    expect(calculateDiscount(pkg, cost)).toBe(0);
  });

  test("Total cost includes discount", () => {
    const pkg = { id: "PKG1", weight: 100, distance: 150, offerCode: "OFR001" };
    const result = calculateTotalCost(100, pkg);
    expect(result.discount).toBeGreaterThan(0);
    expect(result.total).toBeLessThan(result.weight * 10 + result.distance * 5 + 100);
  });

  test("Estimate delivery times distributes packages efficiently", () => {
    const packages = [
      { id: "PKG1", weight: 50, distance: 30 },
      { id: "PKG2", weight: 75, distance: 125 },
      { id: "PKG3", weight: 175, distance: 100 },
      { id: "PKG4", weight: 110, distance: 60 },
      { id: "PKG5", weight: 155, distance: 95 },
    ];
    const results = estimateDeliveryTimes(packages, 2, 70, 200);
    expect(results.length).toBe(5);
    expect(results[0]).toHaveProperty("estimatedTime");
  });
});
