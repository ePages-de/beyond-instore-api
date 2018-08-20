const { ApolloServer } = require('apollo-server');
const { merge } = require('lodash');
const { typeDefs } = require('./typeDefs');
const { ShopResolvers, ShopAPI } = require('./api/shop');
const { ProductManagementResolvers, ProductManagementAPI } = require('./api/product-management');

const resolvers = merge(ShopResolvers, ProductManagementResolvers);

const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({
        shopAPI: new ShopAPI(),
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

const port = process.env.PORT || 4000;
const node = process.env.NODE_ENV || 'development';

server.listen({ port: port })
    .then(({ url }) => {
        console.info(`🚀 Server ready at ${url} for ${node}.`)
    })
    .catch(e => console.error(`Error: ${e}`));
