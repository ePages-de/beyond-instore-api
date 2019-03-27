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
query GetShopAndLegalContent($legalContent: [String!] = ["privacy-policy"]) {
  shop: shop {
    name
    primaryHostname
    defaultLocale
    attributes {
      name
      value
    }
    images {
      label
      data {
        href
      }
    }
  }

  legalContent: allLegalContent(types: $legalContent) {
    type
    content
    pdf {
      href
    }
  }
}
```

## Query Variables

```JSON
{
  "legalContent": [
    "privacy-policy",
    "terms-and-conditions",
    "right-of-withdrawal"
  ]
}
```

## HTTP Headers

```JSON
{
  "X-Beyond-API": "https://instore-checkout.beyondshop.cloud/api"
}
```

### output/response

```json
{
  "data": {
    "shop": {
      "name": "Cork & Culture",
      "primaryHostname": "instore-checkout.beyondshop.cloud",
      "defaultLocale": "en-GB",
      "attributes": [
        {
          "name": "instore-checkout:address",
          "value": "{\"company\":\"Corck & Culture Ltd.\",\"firstName\":\"Sylvia Efe Florian Jens Timo\",\"lastName\":\"ePages\",\"email\":\"t.senechal@epages.com\",\"phone\":null,\"fax\":null,\"street\":\"10 Downing Street\",\"street2\":null,\"postalCode\":\"SW1A 2AA\",\"city\":\"London\",\"state\":null,\"country\":\"GB\"}"
        },
        {
          "name": "instore-checkout:payment-method",
          "value": "https://instore-checkout.beyondshop.cloud/api/payment-methods/2e1746f4-80fe-4519-b4b6-724c74f45d9a"
        },
        {
          "name": "instore-checkout:shipping-method",
          "value": "https://instore-checkout.beyondshop.cloud/api/shipping-zones/3d96dd5e-dd8d-4ea4-8edb-6a08332bbaa3/shipping-methods/50d76a1f-aa45-4208-9f99-f2748e06df98"
        }
      ],
      "images": [
        {
          "label": "logo",
          "data": {
            "href": "https://instore-checkout.beyondshop.cloud/api/core-storage/images/cork&culture.jpg?hash=764711c4e4594ec5638891a107173748ac1bc2ca{&width,height,upscale}"
          }
        }
      ]
    },
    "legalContent": [
      {
        "type": "privacy-policy",
        "content": "",
        "pdf": null
      },
      {
        "type": "terms-and-conditions",
        "content": "",
        "pdf": null
      },
      {
        "type": "right-of-withdrawal",
        "content": "",
        "pdf": null
      }
    ]
  }
}
```
