import { getTripData } from './service'

const fetchMock = require('fetch-mock-jest')

describe("getTripData function", () => {
    test("it should return data when calling get trip data array", () => {
        fetchMock.mock('http://localhost:8082/getAnalysis', Promise.resolve({ data: 'test' }))
        let result = ''
        getTripData('/getTripData').then(res => {
            expect(res.data).toBe('test')
        })
    });
});

