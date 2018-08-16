# Apollo Launchpad

Apollo

https://glitch.com/edit/#!/dog-graphql-api

## GraphQL Query

```graphql
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
    description
    taxClass
    salesPrice {
      amount
      currency
      taxModel
      derivedPrice {
        amount
        currency
        taxModel
        taxRate
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
