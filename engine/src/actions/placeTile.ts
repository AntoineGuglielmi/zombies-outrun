import { GameState, Tile, Position } from '../GameState'

export type PlaceTileAction = {
  tile: Tile
}

export function placeTile(
  state: GameState,
  action: PlaceTileAction,
): GameState {
  const { tile } = action

  // 1. Vérifier qu'aucune tuile n'existe déjà à cette position
  const tileAlreadyThere = Object.values(state.tiles).some(
    (t) => t.position.x === tile.position.x && t.position.y === tile.position.y,
  )

  if (tileAlreadyThere) {
    throw new Error('Invalid placement: tile already exists at position')
  }

  // 2. Vérifier qu'il existe au moins une tuile adjacente
  const hasAdjacentTile = Object.values(state.tiles).some((t) => {
    const dx = Math.abs(t.position.x - tile.position.x)
    const dy = Math.abs(t.position.y - tile.position.y)
    return dx + dy === 1
  })

  if (!hasAdjacentTile) {
    throw new Error(
      'Invalid placement: tile must be adjacent to an existing tile',
    )
  }

  // 3. Ajouter la tuile (immutabilité)
  return {
    ...state,
    tiles: {
      ...state.tiles,
      [tile.id]: tile,
    },
  }
}
