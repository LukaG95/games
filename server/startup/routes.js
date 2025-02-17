const matchRoutes = require('../Routes/matchRoutes');

module.exports = function (app) {
    app.set('trust proxy', 1);
    app.use('/api/match', matchRoutes);
};
