import { useState, useEffect } from 'react'

export function useAgentRatings() {
  const [ratings, setRatings] = useState({})

  useEffect(() => {
    const saved = localStorage.getItem('agent-ratings')
    if (saved) {
      setRatings(JSON.parse(saved))
    }
  }, [])

  const rateAgent = (agentId, value) => {
    const updated = { ...ratings }
    if (!updated[agentId]) {
      updated[agentId] = { up: 0, down: 0 }
    }
    
    updated[agentId][value] = (updated[agentId][value] || 0) + 1
    setRatings(updated)
    localStorage.setItem('agent-ratings', JSON.stringify(updated))
  }

  const getAgentRating = (agentId) => {
    return ratings[agentId] || { up: 0, down: 0 }
  }

  return { rateAgent, getAgentRating }
}