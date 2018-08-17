# Apollo Launchpad

Apollo

https://glitch.com/edit/#!/dog-graphql-api

## GraphQL Query

```graphql
mutation CreateProduct {
  createProduct(
    input: {
      name: "GraphQL product"
      taxClass: REGULAR
      salesPrice: { amount: 9.99, currency: "EUR", taxModel: GROSS }
    }
  ) {
    _id
    sku
  }
}

query ReadProduct($productId: ID!) {
  product(id: $productId) {
    sku
    name
    taxClass
    tags
    visible
    onSale
    essentialFeatures
    description
    availability {
      availabilityState
    }
    attributes {
      namespace
      name
      locale
      type
      value
    }
    images {
      data {
        href
      }
      metadata {
        href
      }
    }
  }
}

query BeyondGraphQL(
  $sort: String = "createdAt"
  $size: Int = 20
  $page: Int = 0
) {
  shop {
    _id
    name
    resellerName
    primaryHostname
    fallbackHostname
    defaultLocale
    defaultCurrency
  }

  products(sort: $sort, size: $size, page: $page) {
    _id
    sku
    name
    visible
    salesPrice {
      amount
      currency
      taxModel
    }
    availability {
      availabilityState
    }
    attributes {
      namespace
      name
      locale
      type
      value
    }
    images {
      data {
        href
      }
    }
  }
}
```

## Query Variables

```JSON
{
  "sort": "createdAt,ASC",
  "page": 0,
  "size": 10
}
```

## HTTP Headers

```JSON
{
  "Authorization": "Bearer <TOKEN>"
}
```
