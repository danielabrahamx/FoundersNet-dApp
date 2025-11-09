import { Market } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { lamportsToSol } from '@/lib/utils'

interface PoolChartProps {
  market: Market
}

export function PoolChart({ market }: PoolChartProps) {
  const yesPoolSol = lamportsToSol(market.yesPool)
  const noPoolSol = lamportsToSol(market.noPool)
  
  const data = [
    {
      name: 'YES',
      value: yesPoolSol,
      fill: '#10b981' // Green for YES
    },
    {
      name: 'NO',
      value: noPoolSol,
      fill: '#ef4444' // Red for NO
    }
  ]
  
  const totalPool = yesPoolSol + noPoolSol
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload[0]) {
      const data = payload[0].payload
      const percentage = ((data.value / totalPool) * 100).toFixed(1)
      return (
        <div className="bg-background border border-border rounded-md p-2 shadow-md">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm">◎{data.value.toFixed(2)} ({percentage}%)</p>
        </div>
      )
    }
    return null
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pool Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(value) => `◎${value.toFixed(0)}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Total Pool: ◎{totalPool.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Historical pool size tracking will be added in future
          </p>
        </div>
      </CardContent>
    </Card>
  )
}