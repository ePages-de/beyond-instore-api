const { ApolloServer } = require("apollo-server");
const { merge } = require("lodash");
const { typeDefs } = require("./typeDefs");
const { ShopResolvers, ShopAPI } = require("./api/shop");
const {
  LegalContentResolvers,
  LegalContentAPI
} = require("./api/legal-content");

const resolvers = merge(ShopResolvers, LegalContentResolvers);

const port = process.env.PORT || 4000;
const node = process.env.NODE_ENV || "development";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    shopAPI: new ShopAPI(),
    legalContentAPI: new LegalContentAPI()
  }),
  context: ({ req }) => ({
    // re-use values from incoming GraphQL client request
    headers: req.headers,
    hostname: req.headers.host,
    beyond_api: req.headers["x-beyond-api"],
    authorization: req.headers.authorization,
    user_agent: "Beyond GraphQL Gateway",
    // all queries share the same trace id
    // see https://stackoverflow.com/a/47496558/1393467
    trace_id: [...Array(32)].map(() => Math.random().toString(16)[3]).join("")
  }),
  formatError: error => {
    console.log(error);
    return error;
  },
  formatResponse: response => {
    //console.log(response);
    return response;
  },
  introspection: true,
  playground: {
    settings: {
      "editor.theme": "light"
    }
  }
});

server
  .listen({ port: port })
  .then(({ url }) => {
    console.info(`🚀 Server ready at ${url} for ${node}.`);
  })
  .catch(e => console.error(`Error: ${e}`));
