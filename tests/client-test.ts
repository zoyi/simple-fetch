import { expect } from 'chai';
import Client from '../src/client';
import Error from '../src/interfaces/error';

const nock = require('nock');

describe('Client', () => {
    const client = new Client();
    describe('setBaseUrl method', () => {
        it('should set base url if argument is string', () => {
            client.setBaseUrl('http://base.url');
            expect(client.baseUrl).to.eq('http://base.url');
        });

        it('should set base url depending on NODE_ENV value if argument is object', () => {
            process.env.NODE_ENV = 'production';
            client.setBaseUrl({
                staging: 'http://dev.base.url',
                production: 'http://base.url',
            });
            expect(client.baseUrl).to.eq('http://base.url');
        });
    });

    describe('fetch method', () => {
        it('should parse json if status is ok', (done) => {
            const responseBody = { key: 'value' };
            nock('http://example.com').get('/test').reply(200, responseBody);
            client.fetch('http://example.com/test').then((res: JSON) => {
                expect(res).to.deep.eq(responseBody);
                done();
            }).catch((err: JSON) => {
                done(err);
            });
        });
        it('should throw error if status is not ok', (done) => {
            const responseBody = { error: 'This is error' }
            nock('http://example.com').get('/test').reply(400, responseBody);
            client.fetch('http://example.com/test').then((res: JSON) => {
                done(true);
            }).catch((err: Error) => {
                expect(err.status).to.eq(400);
                expect(err.body).to.deep.eq(responseBody);
                done();
            });
        });
    });

    describe('get method', () => {
        it('should request GET method to url', (done) => {
            const responseBody = { key: 'value' };
            nock('http://example.com').get('/test').reply(200, responseBody);
            client.setBaseUrl('http://example.com')
            client.get('/test').then((res: JSON) => {
                expect(res).to.deep.eq(responseBody);
                done();
            }).catch((err: JSON) => {
                done(err);
            });
        });
        it('should request GET method to url with encoding query object', (done) => {
            const responseBody = { key: 'value' };
            nock('http://example.com').get('/test?a=b').reply(200, responseBody);
            client.setBaseUrl('http://example.com')
            client.get('/test', { a: 'b' }).then((res: JSON) => {
                expect(res).to.deep.eq(responseBody);
                done();
            }).catch((err: JSON) => {
                done(err);
            });
        });
    });
});
