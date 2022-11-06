const { comparePriceChanges } = require('./compare-price-changes')
const oldProducts = require('./fixtures/compare-price-changes--old.json')
const newProducts = require('./fixtures/compare-price-changes--new.json')

describe('Compare Price Changes', () => {
  it('should detect price changes of the same item', () => {
    const itemsWithPriceChanges = comparePriceChanges(oldProducts, newProducts)

    expect(itemsWithPriceChanges).toEqual([{
      name: 'Full-Zip Color Block Jacket',
      oldPrice: 170,
      newPrice: 150
    }])
  })
})
