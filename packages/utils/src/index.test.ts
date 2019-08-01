import { OR_TIMED_OUT, orTimeout } from '.'

const sleep = ms => new Promise(res => setTimeout(res, ms))

describe('orTimeout', () => {
  it('should orTimeout longer tasks', async () => {
    let didTimeout = false
    try {
      await orTimeout(sleep(80), 10)
    } catch (err) {
      if (err === OR_TIMED_OUT) {
        didTimeout = true
      }
    }
    expect(didTimeout).toBe(true)
  })

  it('shouldnt orTimeout shorter tasks', async () => {
    let didTimeout = false
    try {
      await orTimeout(sleep(10), 20)
    } catch (err) {
      if (err === OR_TIMED_OUT) {
        didTimeout = true
      }
    }
    expect(didTimeout).toBe(false)
  })

  it('should return the value of promise', async () => {
    const val = await orTimeout(
      new Promise(res => {
        res(123)
      }),
      20,
    )
    expect(val).toBe(123)
  })
})
