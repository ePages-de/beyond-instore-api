const { BeyondDataSource } = require('./BeyondDataSource');

class ProductManagementAPI extends BeyondDataSource {
    async createProduct(input) {
        // WTF?
        //return this.post('products', input);
        const string = JSON.stringify(input);
        const object = JSON.parse(string);
        return this.post('products', object);
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
