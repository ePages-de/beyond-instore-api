const { RESTDataSource } = require('apollo-datasource-rest');

class BeyondDataSource extends RESTDataSource {
    get baseURL() {
        // TODO different behaviour per env (dev vs. prod)
        // dev:  POST http://taggle.local.epages.works:4000/
        // prod: POST https://taggle.beyondshop.cloud/graphql/
        const tenant = this.context.hostname.split('.')[0];
        return `https://${tenant}.beyondshop.cloud/api`;
    }

    willSendRequest(request) {
        if (this.context.authorization) {
            request.headers.set('Authorization', this.context.authorization);
        }

        request.headers.set('X-B3-TraceId', this.context.trace_id);
        request.headers.set('User-Agent', this.context.user_agent);
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

module.exports.BeyondDataSource = BeyondDataSource;
