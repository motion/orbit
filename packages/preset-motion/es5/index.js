'use strict';

module.exports = function (context, givenOpts) {
  var opts = givenOpts || {};
  var disable = opts.disable || [];
  var noAsync = opts.async === false;
  var isAsync = !noAsync;
  var getPlugin = function getPlugin(name, opts) {
    if (disable.find(function (x) {
      return x === name;
    })) {
      return null;
    }
    var plugin = require.resolve(name);
    return opts ? [plugin, opts] : plugin;
  };

  var envOpts = Object.assign({
    targets: {
      node: opts.nodeTarget || 'current'
    },
    exclude: isAsync ? ['transform-regenerator', 'transform-async-to-generator'] : []
  }, opts.env || {});

  var config = {
    plugins: [
    // getPlugin('babel-plugin-transform-runtime'),
    // order important here
    getPlugin('babel-plugin-transform-decorators-legacy-without-clutter'), getPlugin('babel-plugin-transform-class-properties'), getPlugin('babel-plugin-sitrep'), getPlugin('@mcro/gloss/transform', {
      decoratorName: opts.decorator || 'view',
      jsxIf: opts.jsxIf || true
    }), getPlugin('babel-plugin-root-import', [{
      rootPathPrefix: '~',
      rootPathSuffix: typeof opts.rootSuffix === 'undefined' ? 'src' : opts.rootSuffix
    }]), getPlugin('@mcro/hmr', {
      decoratorName: opts.decorator || 'view',
      transforms: [{
        transform: require.resolve('@mcro/hmr-view'),
        imports: ['react'],
        locals: ['module']
      }]
    })],
    presets: opts.presets || [getPlugin('babel-preset-env', envOpts), getPlugin('babel-preset-react'), isAsync && getPlugin('babel-preset-stage-1-without-async'), noAsync && getPlugin('babel-preset-stage-1')]
  };

  config.plugins = config.plugins.filter(function (x) {
    return !!x;
  });
  config.presets = config.presets.filter(function (x) {
    return !!x;
  });

  return config;
};
//# sourceMappingURL=index.js.map