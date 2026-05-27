import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
export default {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  // Résout les imports ESM avec extension .js vers .ts (nécessaire, car le code source
  // utilise des imports avec .js pour la compatibilité ESM/Node)
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  // Pointe vers ce dossier test_unitaires
  testMatch: ['**/src/tests/**/*.test.ts'],
  //quel fichier mesurer
  collectCoverageFrom: [
    "../server/src/utils/**/*.ts",
    "../server/src/middlewares/**/*.ts",
    "../server/src/controllers/**/*.ts",
    "!../server/src/**/*.d.ts",
  ],
};
