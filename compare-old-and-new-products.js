function compareOldAndNewProducts(oldProducts, newProducts) {
  const getName = (product) => product.Name;
  const isOneIncludedInOther = (one, other) => one.filter((p) => !other.includes(p));
  const oldProductNames = oldProducts.map(getName);
  const newProductNames = newProducts.map(getName);
  const itemsRemovedFromSale = isOneIncludedInOther(oldProductNames, newProductNames);
  const itemsAddedToSale = isOneIncludedInOther(newProductNames, oldProductNames);

  return {
    itemsRemovedFromSale,
    itemsAddedToSale,
  };
}

module.exports = {
  compareOldAndNewProducts,
};
