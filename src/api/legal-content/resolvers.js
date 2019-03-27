const resolvers = {
  Query: {
    legalContent: async (parent, { type }, { dataSources }, info) => {
      return dataSources.legalContentAPI.getLegalContent(type);
    },
    allLegalContent: async (parent, { types }, { dataSources }, info) => {
      return dataSources.legalContentAPI.getAllLegalContent(types);
    }
  }
};

module.exports.LegalContentResolvers = resolvers;
