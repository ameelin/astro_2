export interface Match {
    userId: string;
    astroMethod: string,
    compatibilityScore: number,
    rejected: boolean,
    canOverwrite: boolean
  }