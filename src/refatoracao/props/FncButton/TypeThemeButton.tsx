export const TypeThemeButton = {
  Default: 0,
  Cancel: 1,
  Delete: 2,
  Icon: 3,
} as const;

export type TypeThemeButton =
  (typeof TypeThemeButton)[keyof typeof TypeThemeButton];
//Alternativa para um enum
