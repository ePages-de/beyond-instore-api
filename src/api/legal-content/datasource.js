const { BeyondDataSource } = require("../BeyondDataSource");

const cacheOptions = { cacheOptions: { ttl: 120 } };

const createLink = link =>
  link
    ? {
        href: link.href,
        templated: link.templated ? true : false
      }
    : {};

class LegalContentAPI extends BeyondDataSource {
  async getLegalContent(type) {
    const response = await this.get(
      `legal-content/${type}`,
      undefined,
      cacheOptions
    );
    return {
      type: response.type,
      content: response.content,
      mandatory: response.mandatory,
      pdf: response._links.pdf ? createLink(response._links.pdf) : null
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

module.exports = { LegalContentAPI };
