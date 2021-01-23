export const environment = {
  production: true,
  apiUrl: 'https://algamoney-api-fs.herokuapp.com',

  tokenAllowedDomains: [ /algamoney-api-fs.herokuapp.com/ ],
  tokenDisallowedRoutes: [/\/oauth\/token/]
};
