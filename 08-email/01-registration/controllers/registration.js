const { v4: uuid } = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const { email, displayName, password } = ctx.request.body;
	const token = uuid();
	try {
		const newUser = new User({ email, displayName, verificationToken: token });
		await newUser.setPassword(password);
		await newUser.save();
    await sendMail({
			template: 'confirmation',
			locals: { token },
			to: email,
			subject: 'Подтвердите почту',
		});
		ctx.body = { status: 'ok' };
	} catch (err) {
		throw(err);
	}
};

module.exports.confirm = async (ctx, next) => {
	const { verificationToken } = ctx.request.body;
	try {
		const user = await User.findOne({ verificationToken });
		if (!user) {
			ctx.throw(400, 'Ссылка подтверждения недействительна или устарела');
			return;
		}
		await User.updateOne({ verificationToken }, { $unset: { verificationToken } });
		const token = await ctx.login(user);
		ctx.body = { token };
	} catch (err) {
		throw err;
	}
};
