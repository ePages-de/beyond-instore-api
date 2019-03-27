const resolvers = {
  Query: {
    shop: async (parent, args, { dataSources }, info) => {
      return dataSources.shopAPI.getShop();
    }
  },

  Shop: {
    attributes: async (parent, args, { dataSources }, info) => {
      return dataSources.shopAPI.getAttributes();
    },
    images: async (parent, args, { dataSources }, info) => {
      return dataSources.shopAPI.getImages();
    }
  }
};

module.exports.ShopResolvers = resolvers;
