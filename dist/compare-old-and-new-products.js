"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareOldAndNewProducts = void 0;
function compareOldAndNewProducts(oldProducts, newProducts) {
    const getName = (product) => product.Name;
    const itemsFromOneAlsoInOther = (one, other) => one.filter((p) => !other.includes(p));
    const oldProductNames = oldProducts.map(getName);
    const newProductNames = newProducts.map(getName);
    const itemsRemovedFromSale = itemsFromOneAlsoInOther(oldProductNames, newProductNames);
    const itemsAddedToSale = itemsFromOneAlsoInOther(newProductNames, oldProductNames);
    return {
        itemsRemovedFromSale,
        itemsAddedToSale
    };
}
exports.compareOldAndNewProducts = compareOldAndNewProducts;
//# sourceMappingURL=compare-old-and-new-products.js.map