const api = (context) => (
    context.dataSources.productManagementAPI
);

const resolvers = {
    Query: {
        products: async (parent, { sort, size, page }, context, info) => {
            return api(context).getProducts(sort, size, page);
        },
        product: async (parent, { id }, context, info) => {
            return api(context).getProduct(id);
        },
    },

    Mutation: {
        createProduct: async (parent, { input }, context, info) => {
            return api(context).createProduct(input);
        },
        createProductAttribute: async (parent, { id, input }, context, info) => {
            return api(context).createProductAttribute(id, input);
        },
        createProductAttributes: async (parent, { id, input }, context, info) => {
            return api(context).createProductAttributes(id, input);
        },
        enableProductStockManagement: async (parent, { id, input }, context, info) => {
            return api(context).enableProductStockManagement(id, input);
        },
        disableProductStockManagement: async (parent, { id }, context, info) => {
            return api(context).disableProductStockManagement(id);
        },

        uploadImage: (parent, { file }) => {
            return file.then(upload => {
                //Contents of Upload scalar: https://github.com/jaydenseric/apollo-upload-server#upload-scalar
                //file.stream is a node stream that contains the contents of the uploaded file
                //node stream api: https://nodejs.org/api/stream.html

                // TODO do something meaningful with the stream, e.g. POST it to BEYOND API
                // see https://github.com/jaydenseric/apollo-upload-examples/blob/master/api/resolvers.mjs#L42
                upload.stream.destroy();

                return upload;
            });
        },
    },

    Product: {
        availability: async ({ _id }, args, context, info) => {
            return api(context).getAvailability(_id);
        },
        attributes: async ({ _id }, args, context, info) => {
            return api(context).getAttributes(_id);
        },
        images: async ({ _id }, args, context, info) => {
            return api(context).getImages(_id);
        },

    }
}

module.exports.ProductManagementResolvers = resolvers;
