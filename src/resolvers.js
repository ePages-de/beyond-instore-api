
// Provide resolver functions for your schema fields
const resolvers = {
  // https://www.apollographql.com/docs/apollo-server/essentials/data.html#type-signature
  Query: {
    shop: async (parent, args, { dataSources }, info) => {
      return dataSources.shopAPI.getShop();
    },
    products: async (parent, { sort, size, page }, { dataSources }, info) => {
      return dataSources.productManagementAPI.getProducts(sort, size, page);
    },
    product: async (parent, { id }, { dataSources }, info) => {
      return dataSources.productManagementAPI.getProduct(id);
    },
  },
  Mutation: {
    createProduct: async (parent, { input }, { dataSources }, info) => {
      return dataSources.productManagementAPI.createProduct(input);
    }
  },
};

module.exports = { resolvers };
