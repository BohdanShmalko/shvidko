const {
  chooseProtocol,
  createLoadBalancer,
  separateUrl,
} = require('../../lib/loadBalancer/createBalancer');
const http = require('http');
const https = require('https');

describe('test creating load balancer', () => {
  test('separate url test', () => {
    const testCases = [
      {
        url: 'http://someHost:3000',
        expected: { protocol: 'http', host: 'someHost', port: '3000' },
      },
      {
        url: 'https://anotherHost:2001',
        expected: { protocol: 'https', host: 'anotherHost', port: '2001' },
      },
      {
        url: 'someBadUrl:4000/main/part',
        expected: undefined,
      },
    ];

    testCases.forEach((testCase) => {
      expect(separateUrl(testCase.url)).toEqual(testCase.expected);
    });
  });

  test('choose protocol', () => {
    expect(chooseProtocol('http://someHost:3000')).toEqual(http);
    expect(chooseProtocol('https://anotherHost:2001')).toEqual(https);
  });
});
