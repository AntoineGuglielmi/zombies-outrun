import { GameState, AgentId } from '../GameState'
import { AgentRole, TileType, ResourceType } from '../enums'

export type SearchRoomAction = {
  agentId: AgentId
}

function rollDie(): number {
  return Math.floor(Math.random() * 6) + 1
}

export function searchRoom(
  state: GameState,
  action: SearchRoomAction,
): GameState {
  const agent = state.agents[action.agentId]
  if (!agent) throw new Error('Agent not found')

  if (agent.location.kind !== 'room') {
    throw new Error('Agent is not in a room')
  }

  if (agent.actionsLeft < 1) {
    throw new Error('Not enough actions')
  }

  const room = state.tiles[agent.location.roomTileId]
  if (!room || room.type !== TileType.TP) {
    throw new Error('Invalid room')
  }

  /* ---------------------------------------------------------------------- */
  /*                            Access restrictions                         */
  /* ---------------------------------------------------------------------- */

  // Piège
  if (room.trapped && agent.role !== AgentRole.Furtif) {
    throw new Error('Only the furtif can search a trapped room')
  }

  // Verrou
  if (room.locked && agent.role !== AgentRole.Costaud) {
    throw new Error('Only the costaud can search a locked room first')
  }

  /* ---------------------------------------------------------------------- */
  /*                        Dépiégeage / déverrouillage                      */
  /* ---------------------------------------------------------------------- */

  let updatedRoom = { ...room }

  if (room.trapped && agent.role === AgentRole.Furtif) {
    updatedRoom.trapped = false
  }

  if (room.locked && agent.role === AgentRole.Costaud) {
    updatedRoom.locked = false
  }

  /* ---------------------------------------------------------------------- */
  /*                              Loot rolls                                */
  /* ---------------------------------------------------------------------- */

  const lootTable = room.lootTable ?? {}
  const furtifBonus = room.furtifBonus ?? {}

  const foundResources: Partial<Record<ResourceType, number>> = {}

  for (const resource of Object.values(ResourceType)) {
    const threshold = lootTable[resource]
    if (!threshold) continue

    let effectiveThreshold = threshold

    if (agent.role === AgentRole.Furtif) {
      effectiveThreshold = threshold - (furtifBonus[resource] ?? 1)
    }

    const roll = rollDie()

    if (roll >= effectiveThreshold) {
      foundResources[resource] = (foundResources[resource] ?? 0) + 1
    }
  }

  /* ---------------------------------------------------------------------- */
  /*                          Apply state changes                           */
  /* ---------------------------------------------------------------------- */

  return {
    ...state,
    tiles: {
      ...state.tiles,
      [room.id]: updatedRoom,
    },
    agents: {
      ...state.agents,
      [agent.id]: {
        ...agent,
        actionsLeft: agent.actionsLeft - 1,
        // ⚠️ stockage de l’inventaire à venir
      },
    },
    // ⚠️ distribution des ressources à venir
  }
}
