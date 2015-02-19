Package.describe({
  summary: 'FabricJS canvas rendering for Meteor',
  version: '0.1.0',
  name: 'jagi:fabricjs',
  git: 'https://github.com/jagi/meteor-fabricjs.git'
});

Npm.depends({
  'fabric': '1.4.13'
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@1.0');

  api.use('jagi:streams@0.1.0');
  api.use('jagi:node-canvas@0.1.0');

  // Client.
  api.addFiles('lib/client/exports.js', 'client');
  api.addFiles('lib/client/fabric.js', 'client');
  api.addFiles('lib/client/export.js', 'client');
  api.addFiles('lib/resources.js', 'client');

  // Server.
  api.addFiles('lib/server/fabric.js', 'server');
  api.addFiles('lib/resources.js', 'server');
  api.addFiles('lib/server/create-canvas-fix.js', 'server');

  // Client & Server.
  api.addFiles('lib/fixes.js', ['client', 'server']);

  api.export(['fabric'], ['client', 'server']);
});
