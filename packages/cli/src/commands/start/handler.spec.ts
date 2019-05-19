import { handler } from './handler'

test('does not throw an error', (): void => {
  const exitSpy = jest.spyOn(process, 'exit')
  // expect(handler).not.toThrowError()
  handler()
  expect(exitSpy).toHaveBeenCalledWith(6)
})
