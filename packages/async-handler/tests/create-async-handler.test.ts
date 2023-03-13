import { describe, it } from 'mocha'
import { assert } from 'chai'
import { createAsyncHandler } from '../src/index.js'
import { spy } from 'nanospy'
import { Request, Response, NextFunction } from 'express-serve-static-core'
import { setImmediateP } from './_util.js'

/* eslint-disable @typescript-eslint/no-empty-function */

describe('createAsyncHandler', () => {
  it(`should pass`, () => {
    createAsyncHandler(async () => {})({} as Request, {} as Response, () => {})
  })

  it(`should not call next`, async () => {
    const next = spy()
    createAsyncHandler(async () => {
      await Promise.resolve()
    })({} as Request, {} as Response, next)

    // Release event loop to allow next call
    await setImmediateP()

    assert.isFalse(
      next.called,
      'AssertionError -> expected spy not to be called',
    )
  })

  it(`should call next`, async () => {
    const next = spy()
    createAsyncHandler(async () => {
      await Promise.reject()
    })({} as Request, {} as Response, next)

    // Release event loop to allow next call
    await setImmediateP()

    assert.isTrue(next.called, 'AssertionError -> expected spy to be called')
  })

  it(`should call next with rejected arg`, async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const next = spy((s: symbol) => null)
    const nextArg = Symbol(Math.random())

    createAsyncHandler(async () => {
      await Promise.reject(nextArg)
    })({} as Request, {} as Response, next as unknown as NextFunction)

    // Release event loop to allow next call
    await setImmediateP()

    assert.isTrue(next.called, 'AssertionError -> expected spy to be called')
    const nextCallArg = next.calls[0][0] as symbol
    assert.strictEqual(nextCallArg, nextArg)
  })
})
