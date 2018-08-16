const { BeyondDataSource } = require('./BeyondDataSource');

class ProductManagementAPI extends BeyondDataSource {
    async createProduct(input) {
        // WTF?
        //return this.post('products', input);

        const newProduct = {
            sku: input.sku,
            name: input.name,
            description: input.description,
            salesPrice: input.salesPrice,
            taxClass: input.taxClass
        };
        return this.post('products', newProduct);
    }

    async getProducts(sort = 'createdAt,DESC', size = 20, page = 0) {
        const params = {
            page: page,
            sort: sort,
            size: size,
        };

        const response = await this.get('products', params);
        return response._embedded.products;
    }

    async getProduct(id) {
        return this.get(`products/${id}`);
    }
}

module.exports = { ProductManagementAPI };
