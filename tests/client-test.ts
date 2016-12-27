import { expect } from 'chai';
import Client from '../src/client';
import Error from '../src/interfaces/error';

const nock = require('nock');

describe('Client', () => {
    const client = new Client();
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
});
