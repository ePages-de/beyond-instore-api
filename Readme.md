# Apollo Launchpad

Apollo

https://glitch.com/edit/#!/dog-graphql-api

## Run

```sh
$ npm start

> beyond-apollo@0.0.1 start /Users/jfischer/dev/git/ng/ng-spikes/apollo-graphql-gateway
> node --inspect src/index.js

Debugger listening on ws://127.0.0.1:9229/e45c95ea-a519-440b-aa76-28221ef521e1
For help, see: https://nodejs.org/en/docs/inspector
🚀 Server ready at http://localhost:4000/ for development.

$ open chrome://inspect/#devices
```

### Debugging

```sh
$ ndb .
```

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

mutation DisableStockManagement($productId: ID!) {
  disableProductStockManagement(id: $productId) {
    availabilityState
  }
}

mutation EnableStockManagement($productId: ID!) {
  enableProductStockManagement(
    id: $productId
    input: { initialAvailableStock: 100, stockThreshold: 5 }
  ) {
    availabilityState
  }
}

mutation CreateMultipleProductAttributes($productId: ID!) {
  createProductAttributes(
    id: $productId
    input: [
      {
        namespace: "custom"
        name: "color"
        locale: "en-GB"
        type: "STRING"
        value: "red"
      }
      {
        namespace: "custom"
        name: "size"
        locale: "en-GB"
        type: "STRING"
        value: "S"
      }
    ]
  )
}

mutation CreateProductAttributes($productId: ID!) {
  firstAtt: createProductAttribute(
    id: $productId
    input: {
      namespace: "custom"
      name: "color"
      locale: "en-GB"
      type: "STRING"
      value: "green"
    }
  )
  secondAtt: createProductAttribute(
    id: $productId
    input: {
      namespace: "custom"
      name: "size"
      locale: "en-GB"
      type: "STRING"
      value: "XL"
    }
  )
}

mutation UploadImage($file: Upload!) {
  uploadImage(file: $file) {
    filename
    mimetype
    encoding
  }
}

query ReadProduct($productId: ID!) {
  product(id: $productId) {
    _id
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

### Uploading image

See [multipart form field structure](https://github.com/jaydenseric/graphql-multipart-request-spec#multipart-form-field-structure)

#### request

```sh
$ curl -vvvv localhost:4000 \
  -F operations='{ "query": "mutation ($file: Upload!) { uploadImage(file: $file) { filename mimetype encoding} }", "variables": { "file": null } }' \
  -F map='{ "0": ["variables.file"] }' \
  -F 0=@/Users/jfischer/dev/git/kitten-app/src/main/resources/static/images/sad-kitten.jpg
```

#### output/response

```sh
* Rebuilt URL to: localhost:4000/
*   Trying ::1...
* TCP_NODELAY set
* Connected to localhost (::1) port 4000 (#0)
> POST / HTTP/1.1
> Host: localhost:4000
> User-Agent: curl/7.54.0
> Accept: */*
> Content-Length: 33396
> Expect: 100-continue
> Content-Type: multipart/form-data; boundary=------------------------f9c85dd5eea337d4
>
< HTTP/1.1 100 Continue
< HTTP/1.1 200 OK
< X-Powered-By: Express
< Access-Control-Allow-Origin: *
< Content-Type: application/json
< Content-Length: 55
< Date: Mon, 20 Aug 2018 08:50:08 GMT
< Connection: keep-alive
<
{"data":{"uploadImage":{"filename":"sad-kitten.jpg","mimetype":"image/jpeg","encoding":"7bit"}}}
* Connection #0 to host localhost left intact
```

#### resolver log

```javascript
{ file:
   Promise {
     { stream: [FileStream],
     filename: 'sad-kitten.jpg',
     mimetype: 'image/jpeg',
     encoding: '7bit' } } }
```
