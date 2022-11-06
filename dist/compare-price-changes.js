"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePriceChanges = void 0;
function comparePriceChanges(oldProducts, newProducts) {
    const result = [];
    for (const oldProduct of oldProducts) {
        const found = newProducts.find(newProduct => newProduct.Name === oldProduct.Name);
        if (found == null) {
            break;
        }
        const oldPrice = oldProduct.Price;
        const newPrice = found.Price;
        if (oldPrice !== newPrice) {
            result.push({ name: found.Name, oldPrice, newPrice });
        }
    }
    return result;
}
exports.comparePriceChanges = comparePriceChanges;
//# sourceMappingURL=compare-price-changes.js.map