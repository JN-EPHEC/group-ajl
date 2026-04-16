import { calculateShipping } from "../utils/shipping";
describe("calculateShipping function", () => {
    const distanceCases = [
        { distance: 25, weight: 30, type: "express", expected: 30 },
        { distance: 100, weight: 30, type: "express", expected: 75 },
        { distance: 600, weight: 30, type: "express", expected: 150 },
        { distance: 25, weight: 7, type: "express", expected: 20 },
        { distance: 25, weight: 30, type: "standard", expected: 15 }
    ];
    test.each(distanceCases)("calculateShipping($distance, $weight, $type) should return $expected", ({ distance, weight, type, expected }) => {
        expect(calculateShipping(distance, weight, type)).toBe(expected);
    });
});
//# sourceMappingURL=shipping.test.js.map