import 'whatwg-fetch';

import Error from './interfaces/error';

const Qs = require('qs');

export type Header = { [key: string]: string };
export type Credentials = '' | 'same-origin' | 'include';

export default class Client {

    // Properties

    baseUrl: string;
    defaultHeader: Header;
    credentials: Credentials = '';
    headerInterceptor: (header: Header) => Header = (header) => {
        return header
    }

    // Constructors

    constructor() {
        this.defaultHeader = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
    }

    // Option-related methods

    setBaseUrl(baseUrl: string | any) {
        if (typeof baseUrl === 'string') {
            this.baseUrl = baseUrl;
        } else {
            this.baseUrl = baseUrl[process.env.NODE_ENV];
        }
    }

    setDefaultHeader(header: Header) {
        this.defaultHeader = header;
    }

    setHeaderInterceptor(interceptor: (header: Header) => Header) {
        this.headerInterceptor = interceptor;
    }

    // REST methods

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

    postByForm(url: String, body: any) {
        // TODO: check type of body
        return this.fetch(`${this.baseUrl}${url}`, {
            method: 'post',
            body: body,
            headers: this.headerInterceptor({})
        })
    }

    put(url: String, body?: Object) {
        return this.fetch(`${this.baseUrl}${url}`, {
            method: 'put',
            body: JSON.stringify(body),
        })
    }

    putByForm(url: String, body: any) {
        // TODO: check type of body
        return this.fetch(`${this.baseUrl}${url}`, {
            method: 'put',
            body: body,
            headers: this.headerInterceptor({})
        })
    }

    putByUrlEncoding(url: String, body?: Object) {
        return this.fetch(`${this.baseUrl}${url}`, {
            method: 'put',
            body: Qs.stringify(body, { arrayFormat: 'repeat' }),
            headers: this.getHeaderUrlEncodedContentType()
        })
    }

    delete(url: String) {
        return this.fetch(`${this.baseUrl}${url}`, {
            method: 'delete',
        })
    }

    /**
     * Base fetch method with default tasks (check status, parse json)
     */
    fetch(url: string, options?: Object) {
        return fetch(url, {
            headers: this.getHeader(),
            credentials: this.credentials,
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

    // Private helper methods

    private getHeader() {
        return this.headerInterceptor(this.defaultHeader);
    }

    private getHeaderUrlEncodedContentType() {
        return this.headerInterceptor({
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        })
    }
}