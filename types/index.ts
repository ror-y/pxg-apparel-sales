export interface Product {
  Colors: any[]
  DepartmentName: string
  DiscountPrice: number
  DocumentID: number
  HoverImageUrl: string
  ImageUrl: string
  InStoreDate: string
  IsComingSoon: boolean
  IsLimitedEdition: boolean
  IsNewProduct: boolean
  IsOutOfStock: boolean
  IsSeasonalProduct: boolean
  Name: string
  ParsonsFavorite: string
  Price: number
  ShippingMessage: string
  ShowHeroesDiscountBanner: boolean
  ShowSalesItemBanner: boolean
  Url: string
  __type: string
}

export interface SimplifiedProduct { name: string, oldPrice: number, newPrice: number }
