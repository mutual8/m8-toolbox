import { handler } from './handler'

test('does not throw an error', (): void => {
  expect(handler).not.toThrowError()
})
