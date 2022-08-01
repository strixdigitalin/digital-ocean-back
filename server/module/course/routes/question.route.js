const controller = require('../controllers/question.controller');

module.exports = router => {
  router.get('/v1/questions', Middleware.loadUser, controller.list, Middleware.Response.success('list'));
  router.get('/v1/questions/:id', Middleware.loadUser, controller.findOne, Middleware.Response.success('question'));
  router.post('/v1/questions', Middleware.isAuthenticated, controller.create, Middleware.Response.success('create'));
  router.put('/v1/questions/:id', Middleware.isAuthenticated, controller.findOne, controller.update, Middleware.Response.success('update'));
  router.delete('/v1/questions/:id', Middleware.isAuthenticated, controller.findOne, controller.remove, Middleware.Response.success('remove'));
};
