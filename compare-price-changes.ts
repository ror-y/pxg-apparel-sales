import { SimplifiedProduct, Product } from './types'

export function comparePriceChanges (oldProducts: Product[], newProducts: Product[]): SimplifiedProduct[] {
  const result: SimplifiedProduct[] = []

  for (const oldProduct of oldProducts) {
    const found = newProducts.find(newProduct => newProduct.Name === oldProduct.Name)

    if (found == null) {
      break
    }

    const oldPrice = oldProduct.Price
    const newPrice = found.Price

    if (oldPrice !== newPrice) {
      result.push({ name: found.Name, oldPrice, newPrice })
    }
  }

  return result
}
