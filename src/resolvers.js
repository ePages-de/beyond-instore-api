
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

  module.exports.resolvers = resolvers;
  