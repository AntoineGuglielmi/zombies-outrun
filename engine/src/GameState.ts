export type TileId = string
export type AgentId = string

export type Position = {
  x: number
  y: number
}

export type TileType = 'TD' | 'TC' | 'TP' | 'TE'

export type Tile = {
  id: TileId
  type: TileType
  position: Position
}

export type AgentType = 'player' | 'zombie' | 'injured'

export type Agent = {
  id: AgentId
  type: AgentType
  position: Position
}

export type GameState = {
  turn: number
  tiles: Record<TileId, Tile>
  agents: Record<AgentId, Agent>
}
