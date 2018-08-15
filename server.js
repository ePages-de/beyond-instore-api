const { ApolloServer, gql } = require('apollo-server');
const { RESTDataSource } = require("apollo-datasource-rest");

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    products(sort: String, size: Int, page: Int): [Product]
    shop: Shop
  }

  type Product {
    _id: ID!
    sku: String!
    name: String!
    description: String
    salesPrice: Price
  }

  type Price {
    amount: Float!
    currency: String!
  }

  type Shop {
    _id: ID!
    name: String!
    resellerName: String!
    primaryHostname: String!
    fallbackHostname: String!
    defaultLocale: String!
    defaultCurrency: String!
  }
`;

class BeyondDataSource extends RESTDataSource {
  parseBody(response) {
    const contentType = response.headers.get('Content-Type');
    // fix https://github.com/apollographql/apollo-server/blob/master/packages/apollo-datasource-rest/src/RESTDataSource.ts#L107
    if (contentType && (contentType.startsWith('application/hal+json') || contentType.startsWith('application/json'))) {
      return response.json();
    } else {
      return response.text();
    }    
  }

  resolveURL(request) {
    //console.log("request:", request);
    const url = super.resolveURL(request);
    //console.log("url:", url);
    return url;
  }
}


// ========== P R O D U C T
class ProductAPI extends BeyondDataSource {
  get baseURL() {
    //console.log(this.context);
    return "https://taggle.beyondshop.cloud/api";
  }
  
  async didReceiveResponse(response) {
    if (response.ok) {
      const body = await this.parseBody(response);
      return body._embedded.products;
    } else {
      throw await this.errorFromResponse(response);
    }
  }

  async getProducts(sort = null, size = 20, page = 0) {
    const params = {
      "page": (page !== null) ? `${page}` : "0",
      "sort": (sort !== null) ? `${sort}` : "createdAt",
      "size": (size !== null) ? `${size}` : "20"
    };

    const products = await this.get(`product-view/products`, params);
    return products;
  }
}


// ========== S H O P
class ShopAPI extends BeyondDataSource {
  constructor() {
    super();
    this.baseURL = "https://taggle.beyondshop.cloud/api";
  }

  async didReceiveResponse(response) {
    if (response.ok) {
      const body = await this.parseBody(response);
      return body;
    } else {
      throw await this.errorFromResponse(response);
    }
  }

  async getShop() {
    const shop = await this.get(`shop`);
    return shop;
  }
}

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    products: async (root, { sort, size, page }, { dataSources }) => {
      return dataSources.productAPI.getProducts(sort, size, page);
    },
    shop: async (root, args, { dataSources }) => {
      //console.log("root: ", root);
      //console.log("args: ", args);
      return dataSources.shopAPI.getShop();
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    productAPI: new ProductAPI(),
    shopAPI:  new ShopAPI()
  })
});

server.listen()
  .then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`)
  })
  .catch(e => console.log(`Error: ${e}`));
