// Ambiente de produção (usado em `ng build --configuration production`, o default).
// Ajuste apiBaseUrl para a URL real da API antes do deploy, ou injete via
// variável de ambiente no pipeline de build (substituindo este arquivo).
export const environment = {
  production: true,
  apiBaseUrl: 'https://api.exemplo.com/api',
  appName: 'SAPO',
}
