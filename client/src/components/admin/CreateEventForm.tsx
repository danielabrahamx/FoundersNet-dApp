import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Calendar } from 'lucide-react'
import { EventType } from '@/types/market'
import { eventSchema, EventFormData, generateEventTitle } from '@/lib/validations/eventSchema'
import { useCreateEvent } from '@/hooks/useCreateEvent'

export function CreateEventForm() {
  const [titlePreview, setTitlePreview] = useState('')
  const createEventMutation = useCreateEvent()

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      startupName: '',
      eventType: EventType.SERIES_A,
      description: '',
      resolutionDate: undefined,
      initialLiquidity: 0.5,
    },
  })

  const formValues = form.watch()

  // Update title preview whenever relevant form values change
  const handleFormChange = () => {
    const preview = generateEventTitle(formValues)
    setTitlePreview(preview)
  }

  // Update preview on form changes
  form.watch(handleFormChange)

  const onSubmit = async (data: EventFormData) => {
    await createEventMutation.mutateAsync(data)
    form.reset()
    setTitlePreview('')
  }

  return (
    <div className="space-y-6">
      {titlePreview && (
        <Card className="p-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Event Title Preview:</p>
          <p className="text-lg font-semibold text-blue-700 dark:text-blue-300 mt-2">{titlePreview}</p>
        </Card>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="startupName"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Startup Name *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Acme Corp"
                    {...field}
                  />
                </FormControl>
                <FormDescription>The name of the startup fundraising</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="eventType"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Event Type *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={EventType.SERIES_A}>Series A</SelectItem>
                    <SelectItem value={EventType.SERIES_B}>Series B</SelectItem>
                    <SelectItem value={EventType.ACQUISITION}>Acquisition</SelectItem>
                    <SelectItem value={EventType.IPO}>IPO</SelectItem>
                    <SelectItem value={EventType.OTHER}>Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Type of fundraising event</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Description *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the resolution criteria and any relevant details..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {field.value.length}/1000 characters
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="resolutionDate"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Resolution Date *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <input
                      type="datetime-local"
                      {...field}
                      value={field.value ? format(field.value, "yyyy-MM-dd'T'HH:mm") : ''}
                      onChange={(e) => {
                        const dateString = e.target.value
                        if (dateString) {
                          field.onChange(new Date(dateString))
                        }
                      }}
                      className="w-full pl-10 pr-3 py-2 border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                </FormControl>
                <FormDescription>Must be 1 day to 1 year in the future</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="initialLiquidity"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Initial Liquidity (SOL) *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-sm text-muted-foreground">◎</span>
                    <Input
                      type="number"
                      step="0.1"
                      min="0.5"
                      max="1000"
                      placeholder="0.5"
                      className="pl-6"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Equal liquidity will be added to both YES and NO pools (minimum 0.5 SOL)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={createEventMutation.isPending}
              className="flex-1"
            >
              {createEventMutation.isPending ? 'Creating Event...' : 'Create Event'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset()
                setTitlePreview('')
              }}
              disabled={createEventMutation.isPending}
            >
              Clear
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
