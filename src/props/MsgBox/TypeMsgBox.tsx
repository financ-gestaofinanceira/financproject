export const TypeMsgBox = {
  Question: 0,
  Ok: 1,
} as const;

export type TypeMsgBox = (typeof TypeMsgBox)[keyof typeof TypeMsgBox];
//Alternativa para um enum
