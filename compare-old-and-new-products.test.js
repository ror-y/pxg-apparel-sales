const { compareOldAndNewProducts } = require('./compare-old-and-new-products');
const oldProducts1 = require('./fixtures/old-products--1.json');
const newProducts1 = require('./fixtures/new-products--1.json');

describe('Compare Old and New Products', () => {
  it('should detect items added and removed to the sale', () => {
    const {
      itemsRemovedFromSale,
      itemsAddedToSale,
    } = compareOldAndNewProducts(oldProducts1, newProducts1);

    expect(itemsRemovedFromSale.length).toEqual(1);
    expect(itemsRemovedFromSale[0]).toEqual('BP Signature Polo');
    expect(itemsAddedToSale.length).toEqual(0);
  });
});
