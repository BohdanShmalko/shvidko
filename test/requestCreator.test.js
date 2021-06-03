const requestCreator = require('../lib/requestCreator');

describe('Request Creator test', () => {
    test('request creator check', () => {
        const expectedValue = {
            method: 'get',
            url: '/some/url',
            callback: (req, res) => {},
        };
        const request = requestCreator('get', '/some/url', (req, res) => {});
        expect(request.method).toEqual(expectedValue.method);
        expect(request.url).toEqual(expectedValue.url);
        expect(typeof request.callback).toEqual(typeof expectedValue.callback);
    })
});
