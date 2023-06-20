import jestFetchMock, { GlobalWithFetchMock } from 'jest-fetch-mock'

const customGlobal: GlobalWithFetchMock = global as unknown as GlobalWithFetchMock
customGlobal.fetch = jestFetchMock
customGlobal.fetchMock = customGlobal.fetch
