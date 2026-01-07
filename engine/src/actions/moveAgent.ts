import { GameState, AgentId, Position } from '../GameState'
import { TileType } from '../enums'

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

  const dx = Math.abs(agent.position.x - action.to.x)
  const dy = Math.abs(agent.position.y - action.to.y)

  if (dx + dy !== 1) {
    throw new Error('Invalid move: agent can only move by 1 tile')
  }

  const targetTile = Object.values(state.tiles).find(
    (tile) =>
      tile.position.x === action.to.x && tile.position.y === action.to.y,
  )

  if (!targetTile) {
    throw new Error('Invalid move: no tile at target position')
  }

  // 🚧 NOUVELLE RÈGLE : accès aux pièces
  if (targetTile.type === TileType.TP) {
    throw new Error('Invalid move: cannot enter a room without an access rule')
  }

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
