import React from 'react'
import { Card, CardContent, CardTitle } from '../../../components/ui/Card'
import ProgressBar from '../../../components/ui/ProgressBar'
import { Leaf } from 'lucide-react'

export default function DoshaBalance({ vata = 35, pitta = 40, kapha = 25 }) {
  const doshas = [
    { name: 'Vata', value: vata, color: 'bg-blue-500', description: 'Air & Space' },
    { name: 'Pitta', value: pitta, color: 'bg-red-500', description: 'Fire & Water' },
    { name: 'Kapha', value: kapha, color: 'bg-green-500', description: 'Earth & Water' },
  ]

  return (
    <Card>
      <CardContent>
        <CardTitle icon={Leaf}>Dosha Balance</CardTitle>
        
        <div className="mt-6 space-y-5">
          {doshas.map((dosha, index) => (
            <div key={dosha.name}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-sm font-semibold text-gray-900">{dosha.name}</span>
                  <span className="text-xs text-gray-500 ml-2">({dosha.description})</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{dosha.value}%</span>
              </div>
              <ProgressBar 
                value={dosha.value} 
                max={100} 
                color={dosha.color}
                showValue={false}
              />
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-teal-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Your Prakriti:</span> Pitta-dominant constitution. 
            Focus on cooling foods and calming activities.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
