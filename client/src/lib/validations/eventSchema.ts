import { z } from 'zod'
import { EventType } from '@/types/market'
import { format } from 'date-fns'

export const eventSchema = z.object({
  startupName: z.string().min(2, 'Startup name must be at least 2 characters').max(100, 'Startup name must be at most 100 characters'),
  eventType: z.nativeEnum(EventType),
  description: z.string().min(50, 'Description must be at least 50 characters').max(1000, 'Description must be at most 1000 characters'),
  resolutionDate: z.date()
    .refine(date => date > new Date(), 'Resolution date must be in the future')
    .refine(date => {
      const oneYear = new Date()
      oneYear.setFullYear(oneYear.getFullYear() + 1)
      return date <= oneYear
    }, 'Resolution date must be within 1 year'),
  initialLiquidity: z.number().min(0.5, 'Minimum liquidity is 0.5 SOL').max(1000, 'Maximum liquidity is 1000 SOL'),
})

export type EventFormData = z.infer<typeof eventSchema>

export function generateEventTitle(data: Partial<EventFormData>): string {
  if (!data.startupName || !data.eventType || !data.resolutionDate) return ''

  const dateStr = format(data.resolutionDate, 'MMM d, yyyy')
  let action = ''

  switch (data.eventType) {
    case EventType.SERIES_A:
      action = 'raise Series A'
      break
    case EventType.SERIES_B:
      action = 'raise Series B'
      break
    case EventType.ACQUISITION:
      action = 'be acquired'
      break
    case EventType.IPO:
      action = 'go public (IPO)'
      break
    default:
      action = 'complete event'
  }

  return `Will ${data.startupName} ${action} by ${dateStr}?`
}
