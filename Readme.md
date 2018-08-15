# Apollo Launchpad

Apollo

https://glitch.com/edit/#!/dog-graphql-api

```graphql
query BeyondGraphQL($sort: String) {
  shop {
    _id,
    name,
    resellerName,
    primaryHostname,
    fallbackHostname,
    defaultLocale,
    defaultCurrency
  }
  
  products(sort: $sort) {
    _id
    sku
    name
    salesPrice {
      amount
      currency
    }
  }

}

{
    "sort": "createdAt,DESC"
}
```