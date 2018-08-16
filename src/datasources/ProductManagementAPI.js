const { BeyondDataSource } = require('./BeyondDataSource');

class ProductManagementAPI extends BeyondDataSource {
    async createProduct(input) {
        const body = JSON.stringify(input);
        console.log(body);

        //return this.post('products', body, {'Content-Type': "application/json"});
        return this.post('products', input);
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

module.exports.ProductManagementAPI = ProductManagementAPI;
