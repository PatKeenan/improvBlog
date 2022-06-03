/**
 * 
 * Workaround for the hook-form issue involving default exports https://github.com/react-hook-form/resolvers/issues/396
 * 
 */
module.exports = (path, options) => {
    return options.defaultResolver(path, {
        ...options,
        packageFilter: pkg => {
            if (pkg.name === '@hookform/resolvers') {
                delete pkg['exports'];
                delete pkg['module'];
            }
            return pkg;
        },
    });
};