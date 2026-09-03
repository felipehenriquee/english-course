// Ambiente de desenvolvimento (usado por `ng serve` / `ng build` sem --configuration production).
// Equivalente ao .env do mundo Vite: valores trocados por src/environments/environment.prod.ts
// no build de produção via `fileReplacements` (ver angular.json).
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:3000/api',
  appName: 'Meu App (dev)',
}
