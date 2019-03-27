const { gql } = require("apollo-server");

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    shop: Shop

    legalContent(
      "Type of LegalContent to retrieve."
      type: String!
    ): LegalContent

    allLegalContent(
      "Types of LegalContent to retrieve."
      types: [String!]
    ): [LegalContent]
  }

  # ng-shop: Shop
  """
  The online shop owned by the merchant.
  Find details in the [API docs](http://docs.beyondshop.cloud/#resources-merchant-shop-get).
  """
  type Shop {
    _id: ID!
    name: String!
    resellerName: String!
    primaryHostname: String!
    fallbackHostname: String!
    defaultLocale: String!
    defaultCurrency: String!
    attributes: [Attribute]
    images: [Image]
  }

  type Attribute {
    name: String!
    value: String!
    public: Boolean!
    readOnly: Boolean!
  }

  type Image {
    _id: ID!
    label: String!
    data: Link
    metadata: Link
  }

  type Link {
    href: String!
    templated: Boolean
  }

  type LegalContent {
    type: String!
    content: String!
    mandatory: Boolean!
    pdf: Link
  }
`;

module.exports = { typeDefs };
