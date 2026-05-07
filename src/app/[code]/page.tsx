import { prisma } from '@/lib/db'
import GameRoom from '@/components/GameRoom'
import { redirect } from 'next/navigation'

export default async function Page({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ code: string }>, 
  searchParams: Promise<{ pseudo?: string, key?: string }> 
}) {
  // Await params in Next.js 15+
  const { code } = await params
  const { pseudo, key } = await searchParams

  if (!pseudo) {
    // Redirect back to login if no pseudo provided
    redirect('/jdr')
  }

  // 1. Fetch Room + Related Data
  const room = await prisma.room.findUnique({
    where: { code: code.toUpperCase() },
    include: {
      players: true,
      draws: {
        orderBy: { timestamp: 'desc' },
        include: {
          player: {
            select: { pseudo: true }
          }
        }
      }
    }
  })

  if (!room) return <div className="text-white p-10">Room not found.</div>

  // 2. Fetch Card Library (to map IDs to Images)
  const cardLibrary = await prisma.card.findMany()

  // 3. Identify User Role
  const isGM = room.gmSessionId === key
  
  // Find current player ID based on pseudo
  // (In a real app, use auth/cookies. Here we match pseudo string)
  const currentPlayer = room.players.find(p => p.pseudo === pseudo)
  
  // If player isn't in DB and not GM, they shouldn't be here (or we auto-create them)
  if (!isGM && !currentPlayer) {
     redirect('/jdr') 
  }

  return (
    <GameRoom 
      room={room}
      initialDraws={room.draws}
      cardLibrary={cardLibrary}
      currentUser={{
        pseudo: pseudo,
        isGM: isGM,
        id: isGM ? 'GM' : currentPlayer?.id || 'unknown'
      }}
    />
  )
}