'use client'
import { json } from 'node:stream/consumers'
import Card from './Card'

export default function Table({ draws, cardLibrary, currentUser, activePlayerId }: any) {
  
  // Helper to find Card Data by ID
  const getCardDef = (id: string) => cardLibrary.find((c: any) => c.id === id)

  return (
    <div className="flex flex-col gap-35 pb-20">
      {draws.length === 0 && (
        <div className="text-center text-muted-foreground mt-20 text-xl font-light">
          The table is empty. Waiting for the first draw...
        </div>
      )}

      {draws.map((draw: any) => {
        const isOwner = currentUser.id === draw.playerId
        const canInteract = isOwner && (currentUser.id === activePlayerId)

        return (
          <div key={draw.id} className="relative group">
            <div className="mb-2 text-sm text-muted-foreground uppercase tracking-widest pl-2 border-l-2 border-primary">
              Draw by {draw.player.pseudo || 'Unknown'}
            </div>
            
            <div className="flex flex-wrap gap-15 items-start">
              {(draw.cardsSnapshot as any[]).map((snap, idx) => {
                const def = getCardDef(snap.cardId)
                if (!def) return null

                return (
                  <Card 
                    key={`${draw.id}-${idx}`}
                    data={{ ...snap, drawId: draw.id, index: idx }} 
                    def={def}
                    canFlip={canInteract} 
                  />
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}