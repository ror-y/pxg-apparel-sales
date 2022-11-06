const { compareOldAndNewProducts } = require('./compare-old-and-new-products')
const oldProducts = require('./fixtures/compare-old-and-new-products--old.json')
const newProducts = require('./fixtures/compare-old-and-new-products--new.json')

describe('Compare Old and New Products', () => {
  it('should detect items added to or removed from the sale', () => {
    const {
      itemsRemovedFromSale,
      itemsAddedToSale
    } = compareOldAndNewProducts(oldProducts, newProducts)

    expect(itemsRemovedFromSale.length).toEqual(1)
    expect(itemsRemovedFromSale[0]).toEqual('BP Signature Polo')
    expect(itemsAddedToSale.length).toEqual(0)
  })
})
