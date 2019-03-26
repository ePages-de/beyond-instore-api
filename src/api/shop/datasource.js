const { BeyondDataSource } = require('../BeyondDataSource');

const cacheOptions = { cacheOptions: { ttl: 120 } };

const createLink = (link) => (link ? {
    href: link.href,
    templated: link.templated ? true : false,
} : {});

class ShopAPI extends BeyondDataSource {
    async getShop() {
        return this.get('shop');
    }

    async getAttributes() {
        const response = await this.get("shop/attributes", undefined, cacheOptions);
        return response._embedded ? response._embedded.attributes : [];
    }

    async getImages() {
        const response = await this.get("shop/images", undefined, cacheOptions);
        const images = response._embedded ? response._embedded.images : [];
        return images.map(image => ({
            _id: image._id,
            label: image.label,
            data: createLink(image._links.data),
            metadadata: createLink(image._links.metadadata),
        }));
    }

    async getLegalContent(type) {
        const response = await this.get(`legal-content/${type}`, undefined, cacheOptions);
        return {
            type: response.type,
            content: response.content,
            mandatory: response.mandatory,
            pdf: (response._links.pdf ? createLink(response._links.pdf) : null),
        };
    }

    async getAllLegalContent(types) {
        const legalContent = [];
        for (const type of types) {
            let response = await this.getLegalContent(type);
            legalContent.push(response);
        }
        return legalContent;
    }
}

module.exports = { ShopAPI };
