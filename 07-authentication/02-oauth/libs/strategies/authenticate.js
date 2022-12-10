const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  if (!email) {
    return done(null, false, `Не указан email`);
  }
  const user = await User.findOne({email});
  if (user) {
    return done(null, user);
  }

  try {
    const createdUser = new User({ email, displayName });
    await createdUser.save();
    done(null, createdUser);
  } catch (er) {
    done(er);
  }
};
