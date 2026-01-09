import {
  TileType,
  AgentType,
  AgentRole,
  ResourceType,
  ZombieType,
} from './enums'

/* -------------------------------------------------------------------------- */
/*                                   Basics                                   */
/* -------------------------------------------------------------------------- */

export type TileId = string
export type AgentId = string
export type ZombieId = string

export type Position = {
  x: number
  y: number
}

/* -------------------------------------------------------------------------- */
/*                                 Resources                                  */
/* -------------------------------------------------------------------------- */

export type RoomLootTable = Partial<Record<ResourceType, number>>
export type FurtifBonusTable = Partial<Record<ResourceType, number>>

/* -------------------------------------------------------------------------- */
/*                                  Zombies                                   */
/* -------------------------------------------------------------------------- */

export type Zombie = {
  id: ZombieId
  type: ZombieType
  position: Position // toujours sur une TC
}

/* -------------------------------------------------------------------------- */
/*                                Tiles & Doors                               */
/* -------------------------------------------------------------------------- */

export type Door = {
  corridorPosition: Position // TC donnant accès à la pièce
  locked?: boolean
  trapped?: boolean
}

export type Tile = {
  id: TileId
  type: TileType

  position: Position
  width: number
  height: number

  // TP uniquement
  doors?: Door[]
  trapped?: boolean
  locked?: boolean
  lootTable?: RoomLootTable
  furtifBonus?: FurtifBonusTable
}

/* -------------------------------------------------------------------------- */
/*                                   Agents                                   */
/* -------------------------------------------------------------------------- */

export type AgentLocation =
  | { kind: 'corridor'; position: Position }
  | { kind: 'room'; roomTileId: TileId }

export type Agent = {
  id: AgentId
  type: AgentType
  role: AgentRole
  location: AgentLocation
  actionsLeft: number
  health: number
}

/* -------------------------------------------------------------------------- */
/*                                 Game State                                 */
/* -------------------------------------------------------------------------- */

export type GameState = {
  tiles: Record<TileId, Tile>
  agents: Record<AgentId, Agent>
  zombies: Zombie[]

  turn: number
}
