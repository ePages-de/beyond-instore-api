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

    product(
      "Id of Product to retrieve."
      id: ID!
    ): Product
  }

  type Mutation {
    createProduct(
      "Product to create."
      input: ProductInput!
    ): Product

    createProductAttribute(
      "Id of Product to add Attibute to."
      id: ID!,
      "Attribute to add to the Product."
      input: AttributeInput!
    ): Boolean

    createProductAttributes(
      "Id of Product to add Attibutes to."
      id: ID!,
      "Attributes to add to the Product."
      input: [AttributeInput!]!
    ): Boolean
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
    visible: Boolean!
    onSale: Boolean
    tags: [String]
    essentialFeatures: String
    availability: Availability
    attributes: [Attribute]
    images: [Image]
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

  input AttributeInput {
    namespace: String!
    name: String!
    locale: String!
    type: String!
    value: String!
  }

  type Attribute {
    namespace: String!
    name: String!
    locale: String!
    type: String!
    value: String!
  }

  type Availability {
    availableStock: Int
    stockThreshold: Int
    purchasable: Boolean!
    availabilityState: String!
  }

  type Image {
    _id: ID!
    data: Link
    metadata: Link
  }

  type Link {
    href: String!
    templated: Boolean
  }
`;

module.exports = { typeDefs };
