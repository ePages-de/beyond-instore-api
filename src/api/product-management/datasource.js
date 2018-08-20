const { BeyondDataSource } = require('../BeyondDataSource');

const cacheOptions = { cacheOptions: { ttl: 120 } };

const createLink = (link) => (link ? {
    href: link.href,
    templated: link.templated ? true : false,
} : {});

const fixJson = (input) => (
    JSON.parse(JSON.stringify(input))
);

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
        return response._embedded ? response._embedded.products : [];
    }

    async getProduct(id) {
        return this.get(`products/${id}`);
    }

    async getAvailability(id) {
        return this.get(`products/${id}/availability`, undefined,  cacheOptions);
    }

    async createProductAttribute(id, input) {
        const body = fixJson(input);
        const response = await this.post(`products/${id}/attributes`, body);
        return body;
    }

    async createProductAttributes(id, input) {
        const attributes = [];
        for (const attribute of input) {
            const body = fixJson(attribute);
            let response = await this.createProductAttribute(id, body);
            attributes.push(body);
        }
        return attributes;
    }

    async enableProductStockManagement(id, input) {
        const body = fixJson(input);
        const response = await this.post(`products/${id}/availability/enable-stock-management`, body);
        return response;
    }

    async disableProductStockManagement(id) {
        const response = await this.post(`products/${id}/availability/disable-stock-management`);
        return response;
    }

    async getAttributes(id) {
        const response = await this.get(`products/${id}/attributes`, undefined, cacheOptions);
        return response._embedded ? response._embedded.attributes : [];
    }

    async getImages(id) {
        const response = await this.get(`products/${id}/images`, undefined, cacheOptions);
        const images = response._embedded ? response._embedded.images : [];
        return images.map(image => ({
            _id: image._id,
            data: createLink(image._links.data),
            metadadata: createLink(image._links.metadadata),
        }));
    }
}

module.exports = { ProductManagementAPI };
