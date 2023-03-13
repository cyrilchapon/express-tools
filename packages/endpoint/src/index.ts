import { processRequest } from 'zod-express-middleware'
import { RequestHandler } from 'express'
import { z, ZodType } from 'zod'
import {
  AsyncRequestHandler,
  createAsyncHandler,
} from '@chimanos/express-async-handler'

const createEndpoint =
  <
    TVParams = unknown,
    TVQuery = unknown,
    TVBody = unknown,
    ZVParams extends ZodType<TVParams> = ZodType<TVParams>,
    ZVQuery extends ZodType<TVQuery> = ZodType<TVQuery>,
    ZVBody extends ZodType<TVBody> = ZodType<TVBody>,
  >(schemas?: {
    params?: ZVParams
    query?: ZVQuery
    body?: ZVBody
  }) =>
  (
    handler: AsyncRequestHandler<
      z.infer<ZVParams>,
      unknown,
      z.infer<ZVBody>,
      z.infer<ZVQuery>
    >,
  ): [
    RequestHandler<TVParams, unknown, TVBody, TVQuery>,
    RequestHandler<
      z.infer<ZVParams>,
      unknown,
      z.infer<ZVBody>,
      z.infer<ZVQuery>
    >,
  ] =>
    [processRequest(schemas ?? {}), createAsyncHandler(handler)]

export { createEndpoint }
