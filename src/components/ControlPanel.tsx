'use client'
import { performDraw, setActivePlayer, toggleLock, emptyRoom } from '@/lib/jdr-actions'
import { useTransition } from 'react'

export default function Controls({ room, currentUser, activePlayerId }: any) {
  const [isPending, startTransition] = useTransition()
  
  const handleDraw = () => {
    if(!activePlayerId) return
    startTransition(async () => {
      await performDraw(room.id, activePlayerId, 3) // Draw 3 cards
    })
  }

  const handleSetTurn = (pid: string) => {
    startTransition(async () => {
      await setActivePlayer(room.id, pid)
    })
  }

  // --- GM CONTROLS ---
  if (currentUser.isGM) {
    return (
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
           <span className="text-xs font-bold text-muted-foreground uppercase self-center mr-2">Set Turn:</span>
           {room.players.map((p: any) => (
             <button
               key={p.id}
               onClick={() => handleSetTurn(p.id)}
               disabled={isPending}
               className={`px-3 py-1 rounded text-sm font-bold transition ${
                 activePlayerId === p.id 
                 ? 'bg-primary text-primary-foreground' 
                 : 'bg-muted text-muted-foreground hover:bg-muted/50'
               }`}
             >
               {p.pseudo}
             </button>
           ))}
        </div>

        <div className="flex gap-2">
           {/* Lock/Unlock Toggle */}
           <button 
             onClick={() => startTransition(() => toggleLock(room.id, !room.isLocked))}
             className="px-4 py-2 bg-muted hover:bg-muted/50 rounded text-muted-foreground text-sm font-bold border border-border"
           >
             {room.isLocked ? "🔒 UNLOCK ROOM" : "🔓 LOCK ROOM"}
           </button>

           {/* Empty Room Button */}
           <button 
             onClick={() => {
               if (confirm('Are you sure you want to empty the room? This will kick all players and delete all draws.')) {
                 startTransition(() => emptyRoom(room.id))
               }
             }}
             className="px-4 py-2 bg-muted hover:bg-muted/50 rounded text-muted-foreground text-sm font-bold border border-border"
           >
             🗑️ EMPTY ROOM
           </button>
        </div>
      </div>
    )
  }

  // --- PLAYER CONTROLS ---
  const isMyTurn = currentUser.id === activePlayerId
  
  if (isMyTurn) {
    return (
      <div className="flex items-center justify-center w-full">
         <div className="flex flex-col items-center animate-in slide-in-from-bottom-4 duration-500">
            <p className="text-secondary text-sm mb-2 font-bold uppercase tracking-wider">It is your turn</p>
            <button
              onClick={handleDraw}
              disabled={isPending}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-3 rounded-full font-bold shadow-lg shadow-secondary/20 transform hover:scale-105 transition-all"
            >
              {isPending ? "Drawing..." : "✨ Draw 3 Cards"}
            </button>
         </div>
      </div>
    )
  }

  return (
    <div className="text-center text-muted-foreground text-sm italic">
      Waiting for the Game Master...
    </div>
  )
}