const { ApolloServer, gql } = require('apollo-server');
const { RESTDataSource } = require("apollo-datasource-rest");

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    shop: Shop
    products(
      sort: String,
      size: Int,
      page: Int
    ): [Product]
  }

#  type Mutation {
#    addProduct(
#      sku: String!
#      name: String!
#      description: String
#      salesPrice: Price!
#      taxClass: String!
#    ): Product
#  }

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
    taxClass: String
  }

  # ng-product-management: Price
  type Price {
    amount: Float!
    currency: String!
    taxModel: String!
    taxRate: Float
    derivedPrice: Price!
  }
`;


class BeyondDataSource extends RESTDataSource {
  get baseURL() {
    // TODO different behaviour per env (dev vs. prod)
    // dev:  POST http://taggle.local.epages.works:4000/
    // prod: POST https://taggle.beyondshop.cloud/graphql/
    const tenant = this.context.hostname.split('.')[0];
    return `https://${tenant}.beyondshop.cloud/api`;
  }

  willSendRequest(request) {
    if (this.context.authorization) {
      request.headers.set('Authorization', this.context.authorization);
    }

    request.headers.set('X-B3-TraceId', this.context.trace_id);
    request.headers.set('User-Agent', this.context.user_agent);
  }

  parseBody(response) {
    const contentType = response.headers.get('Content-Type');
    // fix https://github.com/apollographql/apollo-server/blob/master/packages/apollo-datasource-rest/src/RESTDataSource.ts#L107
    if (contentType && (contentType.startsWith('application/hal+json') || contentType.startsWith('application/json'))) {
      return response.json();
    } else {
      return response.text();
    }    
  }
}


// ========== S H O P
class ShopAPI extends BeyondDataSource {
  async getShop() {
    const shop = await this.get(`shop`);
    return shop;
  }
}


// ========== P R O D U C T
class ProductAPI extends BeyondDataSource {
  async didReceiveResponse(response) {
    if (response.ok) {
      const body = await this.parseBody(response);
      return body._embedded.products;
    } else {
      throw await this.errorFromResponse(response);
    }
  }

  async getProducts(sort = "createdAt", size = 20, page = 0) {
    const params = {
      "page": page,
      "sort": sort,
      "size": size,
    };

    const products = await this.get(`products`, params);
    return products;
  }
}


// Provide resolver functions for your schema fields
const resolvers = {
  // https://www.apollographql.com/docs/apollo-server/essentials/data.html#type-signature
  Query: {
    shop: async (parent, args, context, info) => {
      return context.dataSources.shopAPI.getShop();
    },
    products: async (parent, args, context, info) => {
      return context.dataSources.productAPI.getProducts(args.sort, args.size, args.page);
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    shopAPI:  new ShopAPI(),
    productAPI: new ProductAPI(),
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
