import { GameState, AgentId, TileId } from '../GameState'
import { TileType } from '../enums'

export type EnterRoomAction = {
  agentId: AgentId
  roomTileId: TileId
}

export function enterRoom(
  state: GameState,
  action: EnterRoomAction,
): GameState {
  const agent = state.agents[action.agentId]
  const room = state.tiles[action.roomTileId]

  if (!agent) throw new Error('Agent not found')
  if (!room || room.type !== TileType.TP)
    throw new Error('Target tile is not a room')

  if (agent.location.kind !== 'corridor')
    throw new Error('Agent is not in a corridor')

  const corridorPos = agent.location.position

  const hasAccessibleDoor =
    room.doors?.some(
      (door) =>
        door.corridorPosition.x === corridorPos.x &&
        door.corridorPosition.y === corridorPos.y &&
        !door.locked,
    ) ?? false

  if (!hasAccessibleDoor) {
    throw new Error('No accessible door from this corridor')
  }

  const zombieBlocking = state.zombies.some(
    (z) => z.position.x === corridorPos.x && z.position.y === corridorPos.y,
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
          kind: 'room',
          roomTileId: room.id,
        },
      },
    },
  }
}
