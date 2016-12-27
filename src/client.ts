import Error from './interfaces/error';

const fetch = require('isomorphic-fetch');

export default class Client {
    defaultHeader: { [key: string]: string };
    baseUrl: string;

    constructor() {

    }

    setBaseUrl(baseUrl: string | any) {
        if (typeof baseUrl === 'string') {
            this.baseUrl = baseUrl;
        } else {
            this.baseUrl = baseUrl[process.env.NODE_ENV]
        }
    }

    setDefaultHeader(header: { [key: string]: string }) {
        this.defaultHeader = header
    }

    get(url: string, query?: Object) {
        return this.fetch(url, {
            headers: this.defaultHeader
        })
    }

    /**
     * Base fetch method with default tasks (check status, parse json)
     */
    fetch(...args: any[]) {
        return fetch(...args).then(Client.checkStatus)
    }

    /**
     * Check response status code
     * return JSON if status is ok,
     * throw Error if status is not ok.
     */
    static checkStatus(response: any) {
        function parseJSON(response: string) {
            return response ? JSON.parse(response) : response
        }

        if (response.status >= 200 && response.status < 300) {
            return response.text().then(parseJSON)
        }

        return response.text().then(parseJSON).then((json: JSON) => {
            const error: Error = {
                status: response.status,
                statusText: response.statusText,
                body: json
            }
            throw error
        })
    }
}