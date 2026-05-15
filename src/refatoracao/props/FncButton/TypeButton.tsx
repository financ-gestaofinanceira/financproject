export const TypeButton = {
  Button: "button",
  Submit: "submit",
  reset: "reset",
} as const;

export type TypeButton = (typeof TypeButton)[keyof typeof TypeButton];
//Alternativa para um enum
