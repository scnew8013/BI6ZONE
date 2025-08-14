"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type Suit = "hearts" | "diamonds" | "clubs" | "spades"
type Rank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K"

interface PlayingCard {
  suit: Suit
  rank: Rank
  value: number
  id: string
}

interface PlayerHand {
  cards: PlayingCard[]
  bet: number
  isActive: boolean
  isComplete: boolean
  doubled: boolean
}

type GameState = "betting" | "playing" | "dealer-turn" | "game-over"

const suits: Suit[] = ["hearts", "diamonds", "clubs", "spades"]
const ranks: Rank[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10" | "J" | "Q" | "K"]

const suitSymbols = {
  hearts: "♥",
  diamonds: "♦",
  clubs: "♣",
  spades: "♠",
}

function createDeck(): PlayingCard[] {
  const deck: PlayingCard[] = []
  for (const suit of suits) {
    for (const rank of ranks) {
      let value = 0
      if (rank === "A") value = 11
      else if (["J", "Q", "K"].includes(rank)) value = 10
      else value = Number.parseInt(rank)

      deck.push({
        suit,
        rank,
        value,
        id: `${suit}-${rank}-${Math.random()}`,
      })
    }
  }
  return shuffleDeck(deck)
}

function shuffleDeck(deck: PlayingCard[]): PlayingCard[] {
  const shuffled = [...deck]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function calculateHandValue(hand: PlayingCard[]): number {
  let value = 0
  let aces = 0

  for (const card of hand) {
    if (card.rank === "A") {
      aces++
      value += 11
    } else {
      value += card.value
    }
  }

  while (value > 21 && aces > 0) {
    value -= 10
    aces--
  }

  return value
}

function PlayingCardComponent({
  card,
  hidden = false,
  isDealing = false,
  dealIndex = 0,
}: {
  card: PlayingCard
  hidden?: boolean
  isDealing?: boolean
  dealIndex?: number
}) {
  const [isFlipping, setIsFlipping] = useState(false)
  const [showFront, setShowFront] = useState(!hidden)

  useEffect(() => {
    if (hidden && !showFront) {
      // Card flip animation when revealing
      const timer = setTimeout(() => {
        setIsFlipping(true)
        setTimeout(() => {
          setShowFront(true)
          setIsFlipping(false)
        }, 300)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [hidden, showFront])

  const isRed = card.suit === "hearts" || card.suit === "diamonds"

  const cardStyle = {
    animationDelay: isDealing ? `${dealIndex * 200}ms` : "0ms",
    transform: isFlipping ? "rotateY(180deg)" : "rotateY(0deg)",
    transition: "transform 0.3s ease-in-out",
  }

  if (hidden && !showFront) {
    return (
      <div
        className={`w-16 h-24 bg-blue-600 border-2 border-blue-700 rounded-lg flex items-center justify-center shadow-lg transform transition-all duration-300 ${isDealing ? "animate-slide-in" : ""}`}
        style={cardStyle}
      >
        <div className="text-white text-xs">🂠</div>
      </div>
    )
  }

  return (
    <div
      className={`w-16 h-24 bg-white border-2 border-gray-300 rounded-lg flex flex-col items-center justify-between p-1 shadow-lg transform transition-all duration-300 hover:scale-105 ${isDealing ? "animate-slide-in" : ""} ${isRed ? "text-red-500" : "text-black"}`}
      style={cardStyle}
    >
      <div className="text-xs font-bold">{card.rank}</div>
      <div className="text-lg">{suitSymbols[card.suit]}</div>
      <div className="text-xs font-bold rotate-180">{card.rank}</div>
    </div>
  )
}

function HandComponent({
  hand,
  title,
  showValue = true,
  isActive = false,
  isDealing = false,
  hideSecondCard = false,
}: {
  hand: PlayingCard[]
  title: string
  showValue?: boolean
  isActive?: boolean
  isDealing?: boolean
  hideSecondCard?: boolean
}) {
  const value = calculateHandValue(hand)

  return (
    <div
      className={`text-center transition-all duration-300 ${isActive ? "ring-2 ring-yellow-400 ring-opacity-50 rounded-lg p-2" : ""}`}
    >
      <h3 className="text-xl text-white mb-2">
        {title} {showValue && `(${value})`}
        {showValue && value > 21 && <span className="text-red-400 ml-2">BUST!</span>}
        {showValue && value === 21 && hand.length === 2 && <span className="text-yellow-400 ml-2">BLACKJACK!</span>}
      </h3>
      <div className="flex justify-center gap-2 mb-4">
        {hand.map((card, index) => (
          <PlayingCardComponent
            key={card.id}
            card={card}
            hidden={hideSecondCard && index === 1}
            isDealing={isDealing}
            dealIndex={index}
          />
        ))}
      </div>
    </div>
  )
}

export default function BlackjackGame() {
  const [deck, setDeck] = useState<PlayingCard[]>([])
  const [playerHands, setPlayerHands] = useState<PlayerHand[]>([])
  const [dealerHand, setDealerHand] = useState<PlayingCard[]>([])
  const [currentHandIndex, setCurrentHandIndex] = useState(0)
  const [gameState, setGameState] = useState<GameState>("betting")
  const [playerChips, setPlayerChips] = useState(1000)
  const [currentBet, setCurrentBet] = useState(0)
  const [message, setMessage] = useState("Place your bet to start!")
  const [showDealerCard, setShowDealerCard] = useState(false)
  const [isDealing, setIsDealing] = useState(false)
  const [lastBet, setLastBet] = useState(0)

  const dealerValue = calculateHandValue(dealerHand)
  const currentHand = playerHands[currentHandIndex]

  useEffect(() => {
    setDeck(createDeck())
  }, [])

  const dealCard = (currentDeck: PlayingCard[]) => {
    if (currentDeck.length === 0) {
      const newDeck = createDeck()
      return { card: newDeck[0], remainingDeck: newDeck.slice(1) }
    }
    return { card: currentDeck[0], remainingDeck: currentDeck.slice(1) }
  }

  const startGame = async (betAmount: number) => {
    if (betAmount > playerChips) return

    setLastBet(betAmount) // Remember this bet
    setCurrentBet(betAmount)
    setPlayerChips((prev) => prev - betAmount)
    setIsDealing(true)

    let currentDeck = [...deck]
    const newPlayerHand: PlayingCard[] = []
    const newDealerHand: PlayingCard[] = []

    // Deal initial cards with animation delay
    // Player gets 2 cards, dealer gets only 1 card initially
    for (let i = 0; i < 2; i++) {
      await new Promise((resolve) => setTimeout(resolve, 300))

      const { card: playerCard, remainingDeck: deck1 } = dealCard(currentDeck)
      newPlayerHand.push(playerCard)
      currentDeck = deck1
    }

    // Dealer gets only ONE card initially
    await new Promise((resolve) => setTimeout(resolve, 300))
    const { card: dealerCard, remainingDeck: finalDeck } = dealCard(currentDeck)
    newDealerHand.push(dealerCard)
    currentDeck = finalDeck

    setDeck(currentDeck)
    setPlayerHands([
      {
        cards: newPlayerHand,
        bet: betAmount,
        isActive: true,
        isComplete: false,
        doubled: false,
      },
    ])
    setDealerHand(newDealerHand)
    setCurrentHandIndex(0)
    setGameState("playing")
    setShowDealerCard(false)
    setIsDealing(false)

    // Check for blackjack - dealer can't have blackjack with only one card
    const playerBlackjack = calculateHandValue(newPlayerHand) === 21

    if (playerBlackjack) {
      setMessage("Blackjack! You win!")
      setPlayerChips((prev) => prev + betAmount * 2.5)
      setGameState("game-over")
      setShowDealerCard(true)
    } else {
      setMessage("Hit, Stand, Double, or Split?")
    }
  }

  const hit = async () => {
    const { card, remainingDeck } = dealCard(deck)
    const newHands = [...playerHands]
    newHands[currentHandIndex].cards.push(card)

    setPlayerHands(newHands)
    setDeck(remainingDeck)

    const newValue = calculateHandValue(newHands[currentHandIndex].cards)

    if (newValue > 21) {
      newHands[currentHandIndex].isComplete = true
      newHands[currentHandIndex].isActive = false
      setPlayerHands(newHands)

      if (currentHandIndex < playerHands.length - 1) {
        // Move to next hand
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setCurrentHandIndex(currentHandIndex + 1)
        newHands[currentHandIndex + 1].isActive = true
        setPlayerHands(newHands)
        setMessage("Next hand - Hit, Stand, or Double?")
      } else {
        // All hands complete
        stand()
      }
    } else if (newValue === 21 || newHands[currentHandIndex].doubled) {
      // Auto-stand on 21 or after double
      newHands[currentHandIndex].isComplete = true
      newHands[currentHandIndex].isActive = false
      setPlayerHands(newHands)

      if (currentHandIndex < playerHands.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setCurrentHandIndex(currentHandIndex + 1)
        newHands[currentHandIndex + 1].isActive = true
        setPlayerHands(newHands)
        setMessage("Next hand - Hit, Stand, or Double?")
      } else {
        stand()
      }
    }
  }

  const doubleDown = async () => {
    if (playerChips < currentHand.bet) return

    setPlayerChips((prev) => prev - currentHand.bet)

    const newHands = [...playerHands]
    newHands[currentHandIndex].bet *= 2
    newHands[currentHandIndex].doubled = true
    setPlayerHands(newHands)

    // Deal one card and auto-stand
    await hit()
  }

  const split = async () => {
    if (playerChips < currentHand.bet) return
    if (currentHand.cards.length !== 2) return
    if (currentHand.cards[0].rank !== currentHand.cards[1].rank) return

    setPlayerChips((prev) => prev - currentHand.bet)

    const newHands = [...playerHands]
    const originalHand = newHands[currentHandIndex]

    // Create two new hands
    const hand1: PlayerHand = {
      cards: [originalHand.cards[0]],
      bet: originalHand.bet,
      isActive: true,
      isComplete: false,
      doubled: false,
    }

    const hand2: PlayerHand = {
      cards: [originalHand.cards[1]],
      bet: originalHand.bet,
      isActive: false,
      isComplete: false,
      doubled: false,
    }

    // Deal one card to each hand
    const currentDeck = [...deck]
    const { card: card1, remainingDeck: deck1 } = dealCard(currentDeck)
    const { card: card2, remainingDeck: deck2 } = dealCard(deck1)

    hand1.cards.push(card1)
    hand2.cards.push(card2)

    newHands[currentHandIndex] = hand1
    newHands.splice(currentHandIndex + 1, 0, hand2)

    setPlayerHands(newHands)
    setDeck(deck2)
    setMessage("Playing first hand - Hit, Stand, or Double?")
  }

  const stand = async () => {
    const newHands = [...playerHands]
    newHands[currentHandIndex].isComplete = true
    newHands[currentHandIndex].isActive = false
    setPlayerHands(newHands)

    if (currentHandIndex < playerHands.length - 1) {
      // Move to next hand
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setCurrentHandIndex(currentHandIndex + 1)
      newHands[currentHandIndex + 1].isActive = true
      setPlayerHands(newHands)
      setMessage("Next hand - Hit, Stand, or Double?")
    } else {
      // All hands complete, dealer plays
      setGameState("dealer-turn")
      setShowDealerCard(true)
      dealerPlay()
    }
  }

  const dealerPlay = async () => {
    let currentDeck = [...deck]
    const currentDealerHand = [...dealerHand]

    // First, deal the dealer's second card (hole card)
    await new Promise((resolve) => setTimeout(resolve, 500))
    const { card: holeCard, remainingDeck: deck1 } = dealCard(currentDeck)
    currentDealerHand.push(holeCard)
    currentDeck = deck1
    setDealerHand([...currentDealerHand])

    // Then continue hitting until 17 or higher
    while (calculateHandValue(currentDealerHand) < 17) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const { card, remainingDeck } = dealCard(currentDeck)
      currentDealerHand.push(card)
      currentDeck = remainingDeck
      setDealerHand([...currentDealerHand])
    }

    setDeck(currentDeck)

    const finalDealerValue = calculateHandValue(currentDealerHand)
    let totalWinnings = 0
    const resultMessages: string[] = []

    playerHands.forEach((hand, index) => {
      const handValue = calculateHandValue(hand.cards)
      const handLabel = playerHands.length > 1 ? `Hand ${index + 1}` : "You"

      if (handValue > 21) {
        resultMessages.push(`${handLabel}: Bust!`)
      } else if (finalDealerValue > 21) {
        resultMessages.push(`${handLabel}: Dealer busts - You win!`)
        totalWinnings += hand.bet * 2
      } else if (handValue > finalDealerValue) {
        resultMessages.push(`${handLabel}: You win!`)
        totalWinnings += hand.bet * 2
      } else if (finalDealerValue > handValue) {
        resultMessages.push(`${handLabel}: Dealer wins!`)
      } else {
        resultMessages.push(`${handLabel}: Push!`)
        totalWinnings += hand.bet
      }
    })

    setTimeout(() => {
      setPlayerChips((prev) => prev + totalWinnings)
      setMessage(resultMessages.join(" | "))
      setGameState("game-over")
    }, 1000)
  }

  const newGame = () => {
    setPlayerHands([])
    setDealerHand([])
    setCurrentBet(0)
    setCurrentHandIndex(0)
    setGameState("betting")
    setMessage("Place your bet to start!")
    setShowDealerCard(false)
    setIsDealing(false)
    if (deck.length < 20) {
      setDeck(createDeck())
    }
  }

  const canDouble =
    currentHand && currentHand.cards.length === 2 && !currentHand.doubled && playerChips >= currentHand.bet
  const canSplit =
    currentHand &&
    currentHand.cards.length === 2 &&
    currentHand.cards[0].rank === currentHand.cards[1].rank &&
    playerChips >= currentHand.bet &&
    playerHands.length < 4

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 to-green-900 p-4 flex items-center justify-center">
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateY(-100px) rotate(-10deg);
            opacity: 0;
          }
          to {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.5s ease-out forwards;
        }
        
        @keyframes chip-bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }
        
        .animate-chip-bounce {
          animation: chip-bounce 1s ease-in-out;
        }
      `}</style>

      <Card className="w-full max-w-6xl bg-green-700 border-yellow-400 shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl text-white mb-4">🃏 Blackjack 🃏</CardTitle>
          <div className="flex justify-center gap-4 text-white">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              💰 Chips: ${playerChips}
            </Badge>
            {currentBet > 0 && (
              <Badge variant="outline" className="text-lg px-4 py-2 animate-chip-bounce">
                🎯 Bet: ${currentBet}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Dealer's Hand */}
          <div className="text-center">
            <HandComponent hand={dealerHand} title="Dealer" showValue={showDealerCard} isDealing={isDealing} />
          </div>

          {/* Message */}
          <div className="text-center">
            <p className="text-2xl text-white font-bold bg-black bg-opacity-30 rounded-lg p-4 inline-block">
              {message}
            </p>
          </div>

          {/* Player's Hands */}
          <div className="space-y-6">
            {playerHands.map((hand, index) => (
              <div key={index} className="text-center">
                <HandComponent
                  hand={hand.cards}
                  title={playerHands.length > 1 ? `Your Hand ${index + 1}` : "You"}
                  showValue={true}
                  isActive={hand.isActive}
                  isDealing={isDealing}
                />
                {hand.bet !== currentBet && (
                  <Badge variant="outline" className="mt-2">
                    Bet: ${hand.bet}
                  </Badge>
                )}
                {hand.doubled && (
                  <Badge variant="secondary" className="mt-2 ml-2">
                    Doubled
                  </Badge>
                )}
              </div>
            ))}
          </div>

          {/* Game Controls */}
          <div className="flex justify-center gap-4 flex-wrap">
            {gameState === "betting" && (
              <>
                {lastBet > 0 && lastBet <= playerChips && (
                  <Button
                    onClick={() => startGame(lastBet)}
                    className="bg-green-600 hover:bg-green-700 text-lg px-6 py-3 transform hover:scale-105 transition-all border-2 border-yellow-400"
                  >
                    🔄 Repeat ${lastBet}
                  </Button>
                )}
                <Button
                  onClick={() => startGame(10)}
                  disabled={playerChips < 10}
                  className="bg-red-600 hover:bg-red-700 text-lg px-6 py-3 transform hover:scale-105 transition-all"
                >
                  💰 Bet $10
                </Button>
                <Button
                  onClick={() => startGame(25)}
                  disabled={playerChips < 25}
                  className="bg-red-600 hover:bg-red-700 text-lg px-6 py-3 transform hover:scale-105 transition-all"
                >
                  💰 Bet $25
                </Button>
                <Button
                  onClick={() => startGame(50)}
                  disabled={playerChips < 50}
                  className="bg-red-600 hover:bg-red-700 text-lg px-6 py-3 transform hover:scale-105 transition-all"
                >
                  💰 Bet $50
                </Button>
                <Button
                  onClick={() => startGame(100)}
                  disabled={playerChips < 100}
                  className="bg-red-600 hover:bg-red-700 text-lg px-6 py-3 transform hover:scale-105 transition-all"
                >
                  💰 Bet $100
                </Button>
              </>
            )}

            {gameState === "playing" && currentHand && (
              <>
                <Button
                  onClick={hit}
                  className="bg-blue-600 hover:bg-blue-700 text-lg px-6 py-3 transform hover:scale-105 transition-all"
                >
                  👆 Hit
                </Button>
                <Button
                  onClick={stand}
                  className="bg-yellow-600 hover:bg-yellow-700 text-lg px-6 py-3 transform hover:scale-105 transition-all"
                >
                  ✋ Stand
                </Button>
                {canDouble && (
                  <Button
                    onClick={doubleDown}
                    className="bg-purple-600 hover:bg-purple-700 text-lg px-6 py-3 transform hover:scale-105 transition-all"
                  >
                    ⬆️ Double
                  </Button>
                )}
                {canSplit && (
                  <Button
                    onClick={split}
                    className="bg-orange-600 hover:bg-orange-700 text-lg px-6 py-3 transform hover:scale-105 transition-all"
                  >
                    ✂️ Split
                  </Button>
                )}
              </>
            )}

            {gameState === "game-over" && (
              <Button
                onClick={newGame}
                className="bg-green-600 hover:bg-green-700 text-xl px-8 py-4 transform hover:scale-105 transition-all"
                disabled={playerChips === 0}
              >
                {playerChips === 0 ? "💸 Game Over" : "🎮 New Game"}
              </Button>
            )}
          </div>

          {playerChips === 0 && (
            <div className="text-center bg-red-900 bg-opacity-50 rounded-lg p-6">
              <p className="text-white text-2xl mb-4">💸 You're out of chips! Game over!</p>
              <Button
                onClick={() => {
                  setPlayerChips(1000)
                  newGame()
                }}
                className="bg-purple-600 hover:bg-purple-700 text-lg px-6 py-3 transform hover:scale-105 transition-all"
              >
                🔄 Reset Game ($1000)
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
