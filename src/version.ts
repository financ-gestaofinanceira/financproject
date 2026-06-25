const APP_VERSION = {
  stage: "Alpha",
  major: 1, // incrementar quando algum componente quebrar compatibilidade com a versão atual
  minor: 0, // incrementar quando houver mudanças de funcionalidade sem quebrar compatibilidade
  patch: 1, // incrementar a cada correção de bug
  build: 0, // incrementar a cada novo build com algo novo

  toString(): string {
    return `${this.stage} v${this.major}.${this.minor}.${this.patch}.${this.build}`;
  },
};

export default APP_VERSION;
