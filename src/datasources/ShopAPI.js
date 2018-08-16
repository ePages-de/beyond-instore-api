const { BeyondDataSource } = require('./BeyondDataSource');

class ShopAPI extends BeyondDataSource {
    async getShop() {
        return this.get('shop');
    }
}

module.exports = { ShopAPI };
