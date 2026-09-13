export const environment = {
  production: false,

  azure: {
    clientId: '51023582-39a3-4ed6-809b-bf819dea59a1',
    tenantId: '3070fad0-b050-48d9-b664-a1cb8ddc6e0a',

    authority:
      'https://login.microsoftonline.com/3070fad0-b050-48d9-b664-a1cb8ddc6e0a',

    redirectUri: 'http://localhost:4200',

    api: {
      clientId: '51023582-39a3-4ed6-809b-bf819dea59a1',

      scope:
        'api://20d1c6a6-0709-469d-9cf8-a8a09af6de0b/access_as_user2',

      // AGREGAMOS /api AL FINAL DE LA URL
      url: 'https://w0fjqef3m3.execute-api.us-east-1.amazonaws.com/desarrollo/api',
    },
  },
};