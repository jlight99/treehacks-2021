export const USER_GREEN = '#27AE60'
export const USER_BLUE = '#2D9CDB'
export const USER_ORANGE = '#F2994A'
export const USER_BLUEVIOLET = '#8A2BE2'
export const USER_CRIMSON = '#DC143C'

export const getUserColour = (user) => {
  switch (user) {
    case 'Robbie':
      return USER_BLUE
    case 'Bimesh':
      return USER_GREEN
    case 'Ellen':
      return USER_ORANGE
    default:
      return USER_BLUEVIOLET
  }
}
