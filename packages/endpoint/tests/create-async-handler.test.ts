import { describe, it } from 'mocha'
import { assert } from 'chai'
import { createEndpoint } from '../src/index.js'
import { spy } from 'nanospy'
import { Request, Response } from 'express-serve-static-core'
import {
  assertSpyCalled,
  assertSpyNotCalled,
  mockRes,
  setImmediateP,
} from './_util.js'
import { z } from 'zod'

/* eslint-disable @typescript-eslint/no-empty-function */

describe('createEndpoint', () => {
  describe('validator middleware', () => {
    it(`should pass`, () => {
      const endpoint = createEndpoint()(async () => {})
      const [validatorMiddleware] = endpoint
      validatorMiddleware({} as Request, {} as Response, () => {})
    })

    it(`should not early return response with passing schema`, async () => {
      const next = spy()
      const res = mockRes()
      const endpoint = createEndpoint({
        body: z.literal('body'),
        params: z.literal('params'),
        query: z.literal('query'),
      })(async () => {})
      const [validatorMiddleware] = endpoint
      validatorMiddleware(
        {
          body: 'body',
          params: 'params',
          query: 'query',
        } as unknown as Request,
        res,
        next,
      )

      // Release event loop to allow next call
      await setImmediateP()
      assertSpyCalled(next)
      assertSpyNotCalled(res.send)
    })

    const testCases = [
      { body: 'body' },
      { params: 'params' },
      { query: 'query' },
      {},
      { body: 1, params: 1, query: 1 },
      { body: 'body', params: 'params', query: 1 },
      { body: 'body', params: 1, query: 'query' },
      { body: 1, params: 'params', query: 'query' },
    ]

    testCases.forEach((testCase) => {
      it(`should early return response with bad schema ${JSON.stringify(
        testCase,
      )}`, async () => {
        const next = spy()
        const res = mockRes()
        const endpoint = createEndpoint({
          body: z.literal('body'),
          params: z.literal('params'),
          query: z.literal('query'),
        })(async () => {})
        const [validatorMiddleware] = endpoint

        validatorMiddleware(testCase as unknown as Request, res, next)

        // Release event loop to allow next call
        await setImmediateP()

        assertSpyNotCalled(next)
        assertSpyCalled(res.send)
      })
    })

    testCases.forEach((testCase) => {
      it(`should return 400 with bad schema ${JSON.stringify(
        testCase,
      )}`, async () => {
        const res = mockRes()
        const endpoint = createEndpoint({
          body: z.literal('body'),
          params: z.literal('params'),
          query: z.literal('query'),
        })(async () => {})
        const [validatorMiddleware] = endpoint

        validatorMiddleware(testCase as unknown as Request, res, () => {})

        // Release event loop to allow next call
        await setImmediateP()
        assertSpyCalled(res.status)
        const statusCallArg = res.status.calls[0][0] as number
        assert.strictEqual(statusCallArg, 400)
      })
    })
  })
})
