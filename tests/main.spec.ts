jest.resetModules()

let env: string

beforeEach(() => {
  env = process.env.NODE_ENV
})

afterEach(() => {
  process.env.NODE_ENV = env
  jest.resetAllMocks()
})

const spiedLog = jest.spyOn(console, 'log')
spiedLog.mockImplementation(() => null)

afterAll(() => {
  spiedLog.mockRestore()
})

test('show log in development env', () => {
  process.env.NODE_ENV = 'development'
  const { setFilter, getLogger } = require('../src/main')
  setFilter()
  const { debug } = getLogger('/some/file')
  debug('debug message')
  expect(console.log).toHaveBeenCalledTimes(1)
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('/some/file'), expect.stringContaining('ms'))
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('debug message'), expect.stringContaining('ms'))
})

test('do not show log in other env', () => {
  const { setFilter, getLogger } = require('../src/main')
  setFilter()
  const { debug } = getLogger('/some/file')
  debug('debug message')
  expect(console.log).not.toHaveBeenCalled()
})
