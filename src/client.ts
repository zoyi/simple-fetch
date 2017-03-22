import Error from './interfaces/error';

const fetch = require('isomorphic-fetch');
const Qs = require('qs');
const FormData = require('form-data');

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

    post(url: String, body?: Object | FormData) {
        if (body instanceof FormData) {
            return this.fetch(`${this.baseUrl}${url}`, {
                method: 'post',
                body: body,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
        }
        return this.fetch(`${this.baseUrl}${url}`, {
            method: 'post',
            body: JSON.stringify(body),
        })
    }

    put(url: String, body?: Object) {
        if (body instanceof FormData) {
            return this.fetch(`${this.baseUrl}${url}`, {
                method: 'put',
                body: body,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
        }
        return this.fetch(`${this.baseUrl}${url}`, {
            method: 'put',
            body: JSON.stringify(body),
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
}