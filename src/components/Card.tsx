'use client'
import React from 'react'
import styles from './Card.module.css'
import { revealCard } from '@/lib/jdr-actions'
import { useState } from 'react'

export default function Card({ data, def, canFlip, isDeck, onDeckClick }: any) {
  const [isFlipping, setIsFlipping] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Special mode: just render the card back for the deck pile
  if (isDeck) {
    return (
      <div className={`${styles.scene} cursor-pointer transition-transform duration-300 hover:-translate-y-2 hover:scale-105`} onClick={onDeckClick}>
        <div className={styles.card}>
          <div className={styles.back}>
            <img src="/images/jdr/CardBackDark.avif" alt="Deck" className="w-full h-full object-cover shadow-xl rounded-[inherit]" />
          </div>
        </div>
      </div>
    )
  }

  const isUndrawn = data?.isDrawn === false && !data?.isRevealed;
  if (!isDeck && isUndrawn) {
    return null; // Hide from the table if it's still in the deck pile!
  }
  
  const handleClick = async () => {
    if (canFlip && !data.isRevealed) {
      setIsFlipping(true)
      await revealCard(data.drawId, data.index)
      setIsFlipping(false)
    } else if (data.isRevealed) {
      setIsModalOpen(true)
    }
  }
  
  const cardClasses = (data.isReversed ? (
    "w-full h-full object-cover rotate-180"
    ) : (
      "w-full h-full object-cover"
    )
  )

  return (
    <>
      <div 
        className={`${styles.scene} animate-in fade-in slide-in-from-top-8 zoom-in-75 duration-300`}
        style={{ animationFillMode: 'both' }}
      >
        <div className={`${styles.card} ${data.isRevealed ? styles.flipped : ''}`}>
          
          {/* BACK OF CARD */}
          <div 
            className={`${styles.back} ${canFlip && !data.isRevealed && !isFlipping ? 'cursor-pointer hover:brightness-110 transition-all' : ''}`}
            onClick={(canFlip && !data.isRevealed && !isFlipping) ? handleClick : undefined}
          >
            <img src="/images/jdr/CardBackDark.avif" alt="Card Back" className="w-full h-full object-cover rounded-[inherit]" />
          </div>

          {/* FACE OF CARD */}
          {/* Added 'relative group' to enable the overlay positioning and hover trigger */}
          <div className={`${styles.face} relative group cursor-pointer`} onClick={handleClick}>
            
            {/* --- STANDARD CONTENT --- */}
            <div className='h-7 flex items-center justify-center'>
              <p className="text-sm truncate px-2">{def.name}</p>
            </div>

            {/* Card Image */}
            <div className="flex-1 relative w-full overflow-hidden">
               {def.imagePath ? (
                  <img src={def.imagePath} alt={def.name} className={cardClasses} />
               ) : (
                  <img src={"https://qtqwill.dev/images/jdr/MTA/Arcana_0_Fool.avif"} alt={"The Fool"} className={cardClasses} />
               )}
            </div>

            {/* Card Short Desc */}
            <div className='text-xs h-10 flex justify-center items-center px-2 text-center leading-tight bg-muted text-muted-foreground'>
              <p className="line-clamp-2">{def.shortDesc}</p>
            </div>

            {/* <pre>
              {JSON.stringify(data, null, 2)}
            </pre> */}

            {/* --- HOVER OVERLAY (Full Desc) --- */}
            {/* <div className="absolute inset-0 mt-7 h-63 bg-card/95 text-card-foreground p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-center z-10 rounded-[inherit]">
              <p className="text-xs leading-relaxed overflow-y-auto max-h-full scrollbar-thin scrollbar-thumb-muted-foreground">
                {def.fullDesc || "No details available."}
              </p>
            </div> */}

          </div>
        </div>
      </div>

      {/* --- BIG SCREEN MODAL POPUP --- */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-card text-card-foreground border border-border p-6 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col md:flex-row gap-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing the modal
          >
            <button 
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground text-xl"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close"
            >
              ✕
            </button>

            {/* Image Section */}
            <div className="flex-shrink-0 w-full md:w-1/2 flex items-start justify-center">
              <img 
                src={def.imagePath || "https://qtqwill.dev/images/jdr/MTA/Arcana_0_Fool.avif"} 
                alt={def.name} 
                className={`w-full max-w-sm rounded-lg shadow-md object-contain ${data.isReversed ? 'rotate-180' : ''}`} 
              />
            </div>

            {/* Details Section */}
            <div className="flex flex-col gap-4 flex-1">
              <div>
                <h2 className="text-2xl font-bold text-primary">{def.name}</h2>
                {data.isReversed && (
                  <span className="text-xs font-bold text-destructive uppercase tracking-widest">Reversed</span>
                )}
              </div>
              
              <p className="text-sm italic text-muted-foreground border-b border-border pb-4">
                {def.shortDesc}
              </p>
              
              <div className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                {def.fullDesc || "No details available."}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}