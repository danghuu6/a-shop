const authRouter = require('./auth');
const siteRouter = require('./site')


function route(app) {

    app.use('/', siteRouter);
    app.use('/auth', authRouter);

}

module.exports = route
