const resolvers = {
    Query: {
        shop: async (parent, args, { dataSources }, info) => {
            return dataSources.shopAPI.getShop();
        }
    }
}

module.exports.ShopResolvers = resolvers;
