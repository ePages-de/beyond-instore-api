# Apollo Launchpad

Apollo

https://glitch.com/edit/#!/dog-graphql-api

## GraphQL Query

```graphql
query BeyondGraphQL($sort: String = "createdAt", $size: Int = 10) {
  shop {
    _id
    name
    resellerName
    primaryHostname
    fallbackHostname
    defaultLocale
    defaultCurrency
  }

  products(sort: $sort, size: $size) {
    _id
    sku
    name
    salesPrice {
      amount
      currency
    }
  }
}
```

## Query Variables

```JSON
{
    "sort": "createdAt,DESC"
}
```

## HTTP Headers

```JSON
{
  "X-B3-TraceId": "00000000000000000000000000000001"
}

```