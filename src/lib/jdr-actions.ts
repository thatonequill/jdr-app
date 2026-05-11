'use server'

import { prisma } from '@/lib/db' // Points to your new working singleton
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Type definition for the Card Snapshot stored in JSON
interface CardSnapshot {
  cardId: string
  position: number
  isReversed: boolean
  isRevealed: boolean
  isDrawn?: boolean
}

// --- 1. ROOM MANAGEMENT ---

export async function createRoom(formData: FormData) {
  const code = (formData.get('code') as string).toUpperCase()
  const pseudo = formData.get('pseudo') as string
  const gmSessionId = crypto.randomUUID()

  const existing = await prisma.room.findUnique({
    where: { code },
    include: { _count: { select: { players: true } } }
  })

  if (existing) {
    const msOld = Date.now() - existing.updatedAt.getTime()
    const hoursOld = msOld / (1000 * 60 * 60)
    const hasPlayers = existing._count.players > 0

    // 1. Check Busy Status
    // Busy if: (< 24h AND players exist) OR (< 72h AND players still exist)
    if (hasPlayers && hoursOld < 72) {
      throw new Error("Room is currently occupied by active players.")
    }

    // 2. Cleanup & Reset (Triggers if empty > 24h OR forced > 72h)
    // We use a transaction to ensure atomic "clutter" removal
    await prisma.$transaction([
      // Manually clear nested relations if your schema doesn't have CASCADE DELETE
      
      prisma.draw.deleteMany({ where: { roomId: existing.id } }),
      prisma.player.deleteMany({ where: { roomId: existing.id } }),
      prisma.room.update({
        where: { id: existing.id },
        data: {
          gmSessionId: gmSessionId,
          updatedAt: new Date(),
          isLocked: false,
          activePlayerId: null,
        }
      })
    ])
  } else {
    // 3. Brand New Room
    await prisma.room.create({
      data: { code, gmSessionId }
    })
  }

  redirect(`/${code}?pseudo=${pseudo}&key=${gmSessionId}`)
}

export async function joinRoom(formData: FormData) {
  const code = (formData.get('code') as string).toUpperCase()
  const pseudo = formData.get('pseudo') as string

  const room = await prisma.room.findUnique({ where: { code } })

  if (!room) throw new Error("Room not found")
  if (room.isLocked) throw new Error("Room is locked")

  // Create player
  await prisma.player.create({
    data: { pseudo, roomId: room.id }
  })

  redirect(`/${code}?pseudo=${pseudo}`)
}

// --- 2. GAMEPLAY ---

export async function performDraw(roomId: string, playerId: string, cardCount: number) {
  // 1. Get all card IDs
  const allCards = await prisma.card.findMany({ select: { id: true } })
  if (allCards.length === 0) return 

  // 2. Shuffle
  const shuffled = allCards.sort(() => 0.5 - Math.random())
  const selected = shuffled.slice(0, cardCount)

  // 3. Create JSON Snapshot
  const snapshot: CardSnapshot[] = selected.map((card: { id: any }, index: any) => ({
    cardId: card.id,
    position: index,
    isReversed: Math.random() < 0.38, 
    isRevealed: false,
    isDrawn: false
  }))

  // 4. Save
  await prisma.draw.create({
    data: {
      roomId,
      playerId,
      cardsSnapshot: snapshot as any 
    }
  })

  revalidatePath(`/[code]`)
}

export async function drawCardFromDeck(drawId: string, cardIndex: number) {
  const draw = await prisma.draw.findUnique({ where: { id: drawId } })
  if (!draw) return

  const currentSnapshot = draw.cardsSnapshot as unknown as CardSnapshot[]
  
  if (currentSnapshot[cardIndex]) {
    currentSnapshot[cardIndex].isDrawn = true
    currentSnapshot[cardIndex].isRevealed = true
  }

  await prisma.draw.update({
    where: { id: drawId },
    data: { cardsSnapshot: currentSnapshot as any }
  })

  revalidatePath(`/[code]`)
}

export async function revealCard(drawId: string, cardIndex: number) {
  const draw = await prisma.draw.findUnique({ where: { id: drawId } })
  if (!draw) return

  const currentSnapshot = draw.cardsSnapshot as unknown as CardSnapshot[]
  
  if (currentSnapshot[cardIndex]) {
    currentSnapshot[cardIndex].isRevealed = true
  }

  await prisma.draw.update({
    where: { id: drawId },
    data: { cardsSnapshot: currentSnapshot as any }
  })

  revalidatePath(`/[code]`)
}

// --- 3. GM CONTROLS ---

export async function setActivePlayer(roomId: string, playerId: string) {
  await prisma.room.update({
    where: { id: roomId },
    data: { activePlayerId: playerId }
  })
  // Revalidates any dynamic route matching this structure
  revalidatePath('/[code]', 'page') 
}

export async function toggleLock(roomId: string, isLocked: boolean) {
  await prisma.room.update({
    where: { id: roomId },
    data: { isLocked }
  })
  revalidatePath('/[code]', 'page')
}

export async function emptyRoom(roomId: string) {
  await prisma.$transaction([
    // 1. Delete all draws associated with the room
    prisma.draw.deleteMany({
      where: { roomId },
    }),
    // 2. Delete all players associated with the room
    prisma.player.deleteMany({
      where: { roomId },
    }),
    // 3. Reset the active player on the room to null
    prisma.room.update({
      where: { id: roomId },
      data: { activePlayerId: null },
    }),
  ]);
}
