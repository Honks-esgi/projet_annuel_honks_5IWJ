const appJson = require('./app.json');

module.exports = {
  ...appJson,
  expo: {
    ...appJson.expo,
    experiments: {
      ...appJson.expo.experiments,
      // typed routes génère des types via @expo/cli — le module expo-router
      // n'est pas résolvable depuis root en monorepo Docker, on désactive ici
      typedRoutes: process.env.DOCKER !== '1',
    },
  },
};
