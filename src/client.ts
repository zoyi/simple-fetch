import Error from './interfaces/error';

const fetch = require('isomorphic-fetch');
const Qs = require('qs');

export default class Client {
    defaultHeader: { [key: string]: string };
    baseUrl: string;

    constructor() {
        this.defaultHeader = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
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
        if (query) {
            return this.fetch(`${this.baseUrl}${url}?${Qs.stringify(query)}`)
        }
        return this.fetch(`${this.baseUrl}${url}`)
    }

    post(url: String, body?: Object) {
        return this.fetch(`${this.baseUrl}${url}`, {
            method: 'post',
            body: JSON.stringify(body),
        })
    }

    put(url: String, body?: Object) {
        return this.fetch(`${this.baseUrl}${url}`, {
            method: 'put',
            body: JSON.stringify(body),
        })
    }

    /**
     * Base fetch method with default tasks (check status, parse json)
     */
    fetch(url: string, options?: Object) {
        return fetch(url, {
            headers: this.defaultHeader,
            ...options
        }).then(Client.checkStatus)
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