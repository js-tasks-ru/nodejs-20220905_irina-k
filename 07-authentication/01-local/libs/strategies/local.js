const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    function(email, password, done) {
      User.findOne({
        email: email.toLowerCase(),
      }, async function(err, user) {
        if (!user) {
          done(null, false, 'Нет такого пользователя');
        }
        const isValid = await user.checkPassword(password);
        if (!isValid) {
          done(null, false, 'Неверный пароль');
        }
        done(null, user);
      });
    },
);
