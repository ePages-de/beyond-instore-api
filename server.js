const { ApolloServer, gql } = require('apollo-server');
const { RESTDataSource } = require("apollo-datasource-rest");
const { unique } = require('shorthash');
const _ = require('lodash');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    dogs: [Dog]
    dog(breed: String!): Dog
    products(sort: String): [Product]
  }

  type Dog {
    id: String!
    breed: String!
    displayImage: String
    images: [Image]
    subbreeds: [String]
  }

  type Image {
    url: String!
    id: String!
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

class ProductAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "https://taggle.beyondshop.cloud/api";
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

  async didReceiveResponse(response) {
    if (response.ok) {
      const body = await this.parseBody(response);
      return body._embedded.products;
    } else {
      throw await this.errorFromResponse(response);
    }
  }

  async getProducts(sort) {
    const url = (sort !== null) ? `product-view/products?sort=${sort}` : `product-view/products`;
    const products = await this.get(url);
    return products;
  }
}

const createDog = (subbreeds, breed) => ({
  breed,
  id: unique(breed),
  subbreeds: subbreeds.length > 0 ? subbreeds : null
});

class DogAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "https://dog.ceo/api";
  }

  async didReceiveResponse(response) {
    if (response.ok) {
      const body = await this.parseBody(response);
      return body.message;
    } else {
      throw await this.errorFromResponse(response);
    }
  }

  async getDogs() {
    const dogs = await this.get(`breeds/list/all`);
    return _.map(dogs, createDog);
  }

  async getDog(breed) {
    const subbreeds = await this.get(`breed/${breed}/list`);
    return createDog(subbreeds, breed);
  }

  async getDisplayImage(breed) {
    return this.get(`breed/${breed}/images/random`, undefined, {
      cacheOptions: { ttl: 120 }
    });
  }

  async getImages(breed) {
    const images = await this.get(`breed/${breed}/images`);
    return images.map(image => ({ url: image, id: unique(image) }));
  }
}

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    dogs: async (root, args, { dataSources }) => {
      return dataSources.dogAPI.getDogs();
    },
    dog: async (root, { breed }, { dataSources }) => {
      return dataSources.dogAPI.getDog(breed);
    },
    products: async (root, { sort }, { dataSources }) => {
      return dataSources.productAPI.getProducts(sort);
    }
  },
  Dog: {
    displayImage: async ({ breed }, args, { dataSources }) => {
      return dataSources.dogAPI.getDisplayImage(breed);
    },
    images: async ({ breed }, args, { dataSources }) => {
      return dataSources.dogAPI.getImages(breed);
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    dogAPI: new DogAPI(),
    productAPI: new ProductAPI()
  })
});

server.listen()
  .then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`)
  })
  .catch(e => console.log(`Error: ${e}`));
