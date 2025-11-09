import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface MarketDescriptionProps {
  description: string
}

export function MarketDescription({ description }: MarketDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  // Show read more/less if description is longer than 500 characters
  const shouldShowToggle = description.length > 500
  const displayText = isExpanded || !shouldShowToggle 
    ? description 
    : description.slice(0, 500) + '...'
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Description</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="whitespace-pre-wrap text-sm leading-relaxed">
          {displayText}
        </div>
        
        {shouldShowToggle && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-0 h-auto font-normal"
          >
            {isExpanded ? 'Read less' : 'Read more'}
          </Button>
        )}
        
        <div className="pt-4 border-t">
          <h4 className="font-semibold mb-2">Resolution Criteria</h4>
          <p className="text-sm text-muted-foreground">
            This market will be resolved based on the outcome described above. 
            The resolution will be determined by the market creator or designated 
            resolver after the resolution date has passed.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}