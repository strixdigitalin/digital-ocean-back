const controller = require('../controllers/answer.controller');

module.exports = router => {
  router.get('/v1/answers', Middleware.loadUser, controller.list, Middleware.Response.success('list'));
  router.get('/v1/answers/:id', Middleware.loadUser, controller.findOne, Middleware.Response.success('answer'));
  router.post('/v1/answers', Middleware.isAuthenticated, controller.create, Middleware.Response.success('create'));
  router.put('/v1/answers/:id', Middleware.isAuthenticated, controller.findOne, controller.update, Middleware.Response.success('update'));
  router.delete('/v1/answers/:id', Middleware.isAuthenticated, controller.findOne, controller.remove, Middleware.Response.success('remove'));
  router.get(
    '/v1/answers/:id/check',
    Middleware.isAuthenticated,
    controller.findOne,
    controller.checkCorrect,
    Middleware.Response.success('isCorrect')
  );
};
