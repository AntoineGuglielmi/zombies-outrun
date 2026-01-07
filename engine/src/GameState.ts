import { TileType, AgentType, AgentRole, ResourceType } from './enums'

export type TileId = string
export type AgentId = string

export type Position = {
  x: number
  y: number
}

export type RoomLootTable = Partial<Record<ResourceType, number>>
export type FurtifBonusTable = Partial<Record<ResourceType, number>>

export type Tile = {
  id: TileId
  type: TileType
  position: Position

  // spécifique aux pièces (TP)
  trapped?: boolean
  lootTable?: RoomLootTable
  furtifBonus?: FurtifBonusTable
}

export type Agent = {
  id: AgentId
  type: AgentType
  position: Position

  // uniquement pour les joueurs
  role?: AgentRole
}

export type GameState = {
  turn: number
  tiles: Record<TileId, Tile>
  agents: Record<AgentId, Agent>
}
