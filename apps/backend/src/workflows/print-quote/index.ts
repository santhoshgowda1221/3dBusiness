import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import {
  calculatePrintQuoteStep,
  CalculatePrintQuoteStepInput,
} from "./steps/calculate-print-quote"

// Prices are always derived from the uploaded file on the server, never from
// numbers the browser sends. Persisting quotes and syncing them to Salesforce
// will be added as further steps here.
export const createPrintQuoteWorkflow = createWorkflow(
  "create-print-quote",
  (input: CalculatePrintQuoteStepInput) => {
    const result = calculatePrintQuoteStep(input)
    return new WorkflowResponse(result)
  }
)
