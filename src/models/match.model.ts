export interface Match {
    userId: string,
    userName: string,
    astroMethod: string,
    compatibilityScore: number,
    rejected: boolean,
    canOverwrite: boolean
  }