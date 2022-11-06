import type { Product } from './types'

interface ReturnValue {
  itemsRemovedFromSale: string[]
  itemsAddedToSale: string[]
}

export function compareOldAndNewProducts (oldProducts: Product[], newProducts: Product[]): ReturnValue {
  const getName = (product: Product): string => product.Name
  const itemsFromOneAlsoInOther = (one: string[], other: string[]): string[] => one.filter((p) => !other.includes(p))

  const oldProductNames = oldProducts.map(getName)
  const newProductNames = newProducts.map(getName)

  const itemsRemovedFromSale = itemsFromOneAlsoInOther(oldProductNames, newProductNames)
  const itemsAddedToSale = itemsFromOneAlsoInOther(newProductNames, oldProductNames)

  return {
    itemsRemovedFromSale,
    itemsAddedToSale
  }
}
