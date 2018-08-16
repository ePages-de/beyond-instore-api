const { ApolloServer, gql } = require('apollo-server');
const { ShopAPI } = require('./datasources/ShopAPI');
const { ProductManagementAPI } = require('./datasources/ProductManagementAPI');

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


// Provide resolver functions for your schema fields
const resolvers = {
  // https://www.apollographql.com/docs/apollo-server/essentials/data.html#type-signature
  Query: {
    shop: async (parent, args, context, info) => {
      return context.dataSources.shopAPI.getShop();
    },
    products: async (parent, args, context, info) => {
      return context.dataSources.productManagementAPI.getProducts(args.sort, args.size, args.page);
    },
    product: async (parent, args, context, info) => {
      return context.dataSources.productManagementAPI.getProduct(args.id);
    },
  },
  Mutation: {
    createProduct: async (parent, args, context, info) => {
      return context.dataSources.productManagementAPI.createProduct(args.input);
    }
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    shopAPI:  new ShopAPI(),
    productManagementAPI: new ProductManagementAPI(),
  }),
  context: ({ req }) => ({
    // re-use values from incoming GraphQL client request
    hostname: req.headers.host,
    authorization: req.headers.authorization,
    user_agent: 'Beyond GraphQL Gateway',
    // all queries share the same trace id
    // see https://stackoverflow.com/a/47496558/1393467
    trace_id: [...Array(32)].map(() => Math.random().toString(16)[3]).join(''),
  }),
  formatError: error => {
    //console.log(error);
    return error;
  },
  formatResponse: response => {
    //console.log(response);
    return response;
  },  
  introspection: true,
  playground: {
    settings: {
      'editor.theme': 'dark',
    },
  },
});

server.listen()
  .then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`)
  })
  .catch(e => console.log(`Error: ${e}`));
