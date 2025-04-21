import { classNames } from './classNames'

describe('classNames', () => {
  test('with first param', () => {
    expect(classNames('someClass')).toBe('someClass')
  })

  test('with additional class', () => {
    const expected = 'someClass secondClass thirdClass'
    expect(classNames('someClass', {}, ['secondClass', 'thirdClass'])).toBe(expected)
  })

  test('with mods', () => {
    const expected = 'someClass fourthClass secondClass'
    expect(classNames('someClass', { secondClass: true, thirdClass: false }, ['fourthClass'])).toBe(expected)
  })
})
