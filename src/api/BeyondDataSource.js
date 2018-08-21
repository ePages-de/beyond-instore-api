const { RESTDataSource } = require('apollo-datasource-rest');

class BeyondDataSource extends RESTDataSource {
    get baseURL() {
        const api = this.context.beyond_api;
        const tenant = this.context.hostname.split('.')[0];
        return api || `https://${tenant}.beyondshop.cloud/api`;
    }

    willSendRequest(request) {
        request.headers.set('X-B3-TraceId', this.context.trace_id);
        request.headers.set('User-Agent', this.context.user_agent);
        if (this.context.authorization) {
            request.headers.set('Authorization', this.context.authorization);
        }
    }

    parseBody(response) {
        const contentType = response.headers.get('Content-Type');
        // fix https://github.com/apollographql/apollo-server/blob/master/packages/apollo-datasource-rest/src/RESTDataSource.ts#L107
        if (contentType && (contentType.startsWith('application/hal+json') || contentType.startsWith('application/json'))) {
            return response.json();
        } else {
            return response.text();
        }
    }
};

module.exports = { BeyondDataSource };
