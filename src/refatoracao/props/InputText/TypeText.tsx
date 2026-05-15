export const TypeText = {
  Text: "text",
  Email: "email",
  Password: "password",
  Number: "number",
} as const;

export type TypeText = (typeof TypeText)[keyof typeof TypeText];
//Alternativa para um enum
