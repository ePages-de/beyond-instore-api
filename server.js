const { ApolloServer, gql } = require('apollo-server');
const { RESTDataSource } = require("apollo-datasource-rest");
const { unique } = require('shorthash');
const _ = require('lodash');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    dogs: [Dog]
    dog(breed: String!): Dog
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
`;

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
    dogAPI: new DogAPI()
  })
});

server.listen()
  .then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`)
  })
  .catch(e => console.log(`Error: ${e}`));
