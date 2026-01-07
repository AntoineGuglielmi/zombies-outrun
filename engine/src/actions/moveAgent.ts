import { GameState, AgentId, Position } from '../GameState'

export type MoveAgentAction = {
  agentId: AgentId
  to: Position
}

export function moveAgent(
  state: GameState,
  action: MoveAgentAction,
): GameState {
  const agent = state.agents[action.agentId]

  if (!agent) {
    throw new Error(`Agent ${action.agentId} not found`)
  }

  // Vérification : déplacement d'une case maximum (Manhattan)
  const dx = Math.abs(agent.position.x - action.to.x)
  const dy = Math.abs(agent.position.y - action.to.y)

  if (dx + dy !== 1) {
    throw new Error('Invalid move: agent can only move by 1 tile')
  }

  // Vérification : une tuile existe à la position cible
  const targetTile = Object.values(state.tiles).find(
    (tile) =>
      tile.position.x === action.to.x && tile.position.y === action.to.y,
  )

  if (!targetTile) {
    throw new Error('Invalid move: no tile at target position')
  }

  // Application du déplacement (immutabilité)
  return {
    ...state,
    agents: {
      ...state.agents,
      [agent.id]: {
        ...agent,
        position: action.to,
      },
    },
  }
}
