import { GameState, AgentId } from '../GameState'
import { TileType } from '../enums'

export type ExitRoomAction = {
  agentId: AgentId
  toCorridorPosition: { x: number; y: number }
}

export function exitRoom(state: GameState, action: ExitRoomAction): GameState {
  const agent = state.agents[action.agentId]

  if (!agent) throw new Error('Agent not found')
  if (agent.location.kind !== 'room') throw new Error('Agent is not in a room')

  const room = state.tiles[agent.location.roomTileId]
  if (!room || room.type !== TileType.TP) throw new Error('Invalid room')

  const hasDoor =
    room.doors?.some(
      (door) =>
        door.corridorPosition.x === action.toCorridorPosition.x &&
        door.corridorPosition.y === action.toCorridorPosition.y &&
        !door.locked,
    ) ?? false

  if (!hasDoor) {
    throw new Error('No door leading to this corridor')
  }

  const zombieBlocking = state.zombies.some(
    (z) =>
      z.position.x === action.toCorridorPosition.x &&
      z.position.y === action.toCorridorPosition.y,
  )

  if (zombieBlocking) {
    throw new Error('Corridor is blocked by a zombie')
  }

  if (agent.actionsLeft < 1) {
    throw new Error('Not enough actions')
  }

  return {
    ...state,
    agents: {
      ...state.agents,
      [agent.id]: {
        ...agent,
        actionsLeft: agent.actionsLeft - 1,
        location: {
          kind: 'corridor',
          position: action.toCorridorPosition,
        },
      },
    },
  }
}
