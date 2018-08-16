const { gql } = require('apollo-server');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    shop: Shop
    products(
      sort: String,
      size: Int,
      page: Int
    ): [Product]
    product(id: ID): Product
  }

  type Mutation {
    createProduct(input: ProductInput): Product
  }

  # ng-shop: Shop
  type Shop {
    _id: ID!
    name: String!
    resellerName: String!
    primaryHostname: String!
    fallbackHostname: String!
    defaultLocale: String!
    defaultCurrency: String!
  }

  input ProductInput {
    sku: String
    name: String!
    description: String
    salesPrice: PriceInput!
    taxClass: TaxClass!
  }

  input PriceInput {
    amount: Float!
    currency: String!
    taxModel: TaxModel!
  }

  # ng-product-management: Product
  """
  A typical product for sale in your online shop.
  Find details in the [API docs](http://docs.beyondshop.cloud/#resources-product-get).
  """
  type Product {
    _id: ID!
    sku: String!
    name: String!
    description: String
    salesPrice: Price!
    taxClass: TaxClass
  }

  enum TaxClass {
    REGULAR
    REDUCED
    EXEMPT
  }

  # ng-product-management: Price
  type Price {
    amount: Float!
    currency: String!
    taxModel: TaxModel!
    taxRate: Float
    derivedPrice: Price!
  }

  enum TaxModel {
    GROSS
    NET
  }
`;

module.exports = { typeDefs };
