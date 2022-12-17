module.exports = function mustBeAuthenticated(ctx, next) {
  if (!ctx.user) {
    throw ({
      status: 401,
      message: 'Пользователь не залогинен',
    });
  }
  return next();
};
