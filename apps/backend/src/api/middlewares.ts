import {
  configureStoreSearch,
  defineMiddlewares,
  validateAndTransformBody,
} from '@medusajs/framework/http'
import { PostPrintQuoteSchema } from './store/print-quotes/validators'

// The product index declares filterable `status` and `sales_channel_ids`, so
// the route narrows it to published products in the key's sales channels.
export default defineMiddlewares({
  routes: [
    {
      method: ['POST'],
      matcher: '/store/search',
      middlewares: [
        configureStoreSearch({
          allowed_indexes: {
            product: true,
          },
        }),
      ],
    },
    {
      methods: ['POST'],
      matcher: '/store/print-quotes',
      // STL files arrive base64-encoded in the JSON body
      bodyParser: { sizeLimit: '60mb' },
      middlewares: [validateAndTransformBody(PostPrintQuoteSchema)],
    },
    {
      methods: ['POST'],
      matcher: '/store/carts/:id/print-items',
      bodyParser: { sizeLimit: '60mb' },
      middlewares: [validateAndTransformBody(PostPrintQuoteSchema)],
    },
  ],
})
