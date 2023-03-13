import { spy, SpyFn } from 'nanospy'
import { Response, Send } from 'express-serve-static-core'
import { assert } from 'chai'

/* eslint-disable @typescript-eslint/no-explicit-any */

interface SpyedResponse<
  ResBody = any,
  LocalsObj extends Record<string, any> = Record<string, any>,
  StatusCode extends number = number,
> extends Response<ResBody, LocalsObj, StatusCode> {
  status: SpyFn<(code: StatusCode) => this>
  send: SpyFn<Send<ResBody, this>>
}

const mockRes = () => {
  const baseRes = {} as SpyedResponse

  /* eslint-disable @typescript-eslint/no-unused-vars */
  baseRes.status = spy((n: number) => baseRes)
  baseRes.send = spy((a: any) => baseRes)
  /* eslint-enable @typescript-eslint/no-unused-vars */

  return baseRes
}

const assertSpyCalled = <
  Fn extends (...args: any[]) => any = (...args: any[]) => any,
>(
  spy: SpyFn<Fn>,
) => {
  assert.isTrue(spy.called, 'AssertionError -> expected spy to be called')
}

const assertSpyNotCalled = <
  Fn extends (...args: any[]) => any = (...args: any[]) => any,
>(
  spy: SpyFn<Fn>,
) => {
  assert.isFalse(spy.called, 'AssertionError -> expected spy not to be called')
}

const setTimeoutP = async (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay)
  })
}
const setImmediateP = async () => {
  return new Promise((resolve) => {
    setImmediate(resolve)
  })
}

export type { SpyedResponse }
export {
  assertSpyCalled,
  assertSpyNotCalled,
  mockRes,
  setTimeoutP,
  setImmediateP,
}
