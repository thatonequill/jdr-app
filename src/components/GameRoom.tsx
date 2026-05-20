'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Table from './Table'
import Controls from './ControlPanel'
import { Moon, Sun } from 'lucide-react'
import Card from './Card'
import { drawCardFromDeck } from '@/lib/jdr-actions'
import { createClient } from '@supabase/supabase-js' // Import Supabase client
import cardLibraryData from '@/lib/card-library.json'; // Import the static card library

// Initialize Supabase client outside the component to avoid re-initialization
// Ensure these environment variables are correctly set in your .env.local or deployment environment
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// FIX: The browser on the host machine cannot resolve 'host.docker.internal'.
// We rewrite it to 'localhost' if we are running in the client browser.
if (typeof window !== 'undefined' && supabaseUrl?.includes('host.docker.internal')) {
  supabaseUrl = supabaseUrl.replace('host.docker.internal', 'localhost');
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY) are not set. Realtime functionality may not work.');
}
const supabase = createClient(supabaseUrl!, supabaseAnonKey!); // Using non-null assertion, assuming check above or external configuration

export default function GameRoom({ room, initialDraws, currentUser }: any) {
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const router = useRouter()
  const [draws, setDraws] = useState(initialDraws);
  const [activePlayerId, setActivePlayerId] = useState(room.activePlayerId);
  const [isLocked, setIsLocked] = useState(room.isLocked);

  // REMOVED POLLING: Refresh data every 2 seconds
  // The polling mechanism is replaced by Supabase Realtime subscriptions below.
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     // Next.js "router.refresh()" re-runs the Server Component
  //     // and updates the props of this component securely.
  //     router.refresh()
  //   }, 2000)
  //   return () => clearInterval(interval)
  // }, [router])

  // NEW: Supabase Realtime subscriptions for game updates
  useEffect(() => {
    if (!room?.id) return;

    console.log(`Subscribing to game updates for room: ${room.id}`);

    // Consolidate Realtime channels to multiplex and save connections
    const gameChannel = supabase
      .channel(`game:${room.id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'Room', filter: `id=eq.${room.id}` },
        (payload) => {
          console.log('Supabase Realtime Room UPDATE received:', payload);
          router.refresh(); 
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'Draw', filter: `roomId=eq.${room.id}` },
        (payload) => {
          console.log('Supabase Realtime Draw change received:', payload);
          router.refresh(); 
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'Player', filter: `roomId=eq.${room.id}` },
        (payload) => {
          console.log('Supabase Realtime Player change received:', payload);
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      console.log(`Unsubscribing from Supabase channel for game:${room.id}`);
      supabase.removeChannel(gameChannel);
    };
  }, [room?.id, router]); // Re-subscribe if room.id or router changes
  
  // Sync state with incoming props (from polling)
  useEffect(() => {
    setDraws(room.draws)
    setActivePlayerId(room.activePlayerId)
    setIsLocked(room.isLocked)
  }, [room])
  
  // Setup parameters to determine Deck status
  const latestDraw = draws?.[0];
  const isOwner = currentUser.id === latestDraw?.playerId;
  const totalCards = latestDraw?.cardsSnapshot?.length || 0;
  const undrawnCardsCount = latestDraw ? latestDraw.cardsSnapshot.filter((c: any) => c.isDrawn === false && !c.isRevealed).length : 0;

  const handleDeckClick = async () => {
    if (!latestDraw || !isOwner) return;
    const nextCardIndex = latestDraw.cardsSnapshot.findIndex((c: any) => c.isDrawn === false && !c.isRevealed);
    if (nextCardIndex !== -1) {
      await drawCardFromDeck(latestDraw.id, nextCardIndex);
    }
  };

  return (
    <div className="h-[100dvh] bg-background text-foreground flex flex-col md:flex-row overflow-hidden">      
      {/* SIDEBAR: Players */}
      <aside className="w-full md:w-64 bg-card p-4 border-r border-border flex-shrink-0 crux-font">
        <h2 className="text-xl font-bold text-primary mb-4 tracking-widest">
          {room.code}
        </h2>
        
        <div className="space-y-2">
          {room.players.map((p: any) => (
            <div 
              key={p.id} 
              className={`p-3 rounded transition-all border ${
                activePlayerId === p.id 
                  ? 'bg-primary/30 border-primary text-foreground shadow-[0_0_10px_rgba(var(--primary),0.3)]' 
                  : 'bg-card border-border text-muted-foreground'
              }`}
            >
              <div className="font-bold flex justify-between items-center">
                {p.pseudo}
                {activePlayerId === p.id && <span className="text-xs text-primary animate-pulse">● ACT</span>}
              </div>
            </div>
          ))}
          {room.players.length === 0 && <div className="text-sm text-muted-foreground italic">Waiting for players...</div>}
        </div>
        {/* Dark Mode Toggle */}
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full hover:bg-muted text-foreground transition-colors absolute bottom-5 left-5"
          aria-label="Toggle Theme"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* THE TABLE (Cards) */}
        <div className="flex-1 overflow-y-auto p-4 md:p-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-card to-background flex flex-col items-left">
           
           {/* THE DECK PILE */}
           {latestDraw && undrawnCardsCount > 0 && (
             <div className="mb-8 md:mb-12 flex flex-col items-left animate-in fade-in duration-500">
               <p className="text-secondary text-sm font-bold uppercase mb-4 tracking-widest crux-font">
                 {isOwner ? `Click to Draw (${totalCards - undrawnCardsCount + 1}/${totalCards})` : `Drawing (${totalCards - undrawnCardsCount}/${totalCards})...`}
               </p>
               <div className="relative w-32 h-48 md:w-40 md:h-60">
                 {undrawnCardsCount > 1 && (
                   <div className="absolute inset-0 translate-x-2 translate-y-2 opacity-50 pointer-events-none">
                     <Card isDeck={true} />
                   </div>
                 )}
                 <div className="absolute inset-0 z-10">
                   <Card isDeck={true} onDeckClick={handleDeckClick} />
                 </div>
               </div>
             </div>
           )}
           
           <div className="w-full flex-1">
             <Table 
               draws={draws} 
               cardLibrary={cardLibraryData} 
               currentUser={currentUser}
               activePlayerId={activePlayerId}
             />
           </div>
        </div>

        {/* CONTROLS (Bottom Bar) */}
        <div className="bg-card border-t border-border p-4 z-10 flex-shrink-0 mt-auto">
          <Controls 
            room={room} 
            currentUser={currentUser} 
            activePlayerId={activePlayerId}
          />
        </div>
      </main>

    </div>
  )
}