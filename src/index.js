const { ApolloServer } = require('apollo-server');
const { typeDefs } = require('./typeDefs');
const { resolvers } = require('./resolvers');
const { ShopAPI, ProductManagementAPI } = require('./datasources');

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
      'editor.theme': 'dark',
    },
  },
});

server.listen()
  .then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`)
  })
  .catch(e => console.log(`Error: ${e}`));
