const express = require('express')
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, userStat, Stat } = require('../../db/models');



const router = express.Router();



const validateSignup = [
	check('email')
		.exists({ checkFalsy: true })
		.isEmail()
		.withMessage('Please provide a valid email.'),
	check('username')
		.exists({ checkFalsy: true })
		.isLength({ min: 6 })
		.withMessage('Please provide a username with at least 6 characters.'),
	check('username')
		.exists({ checkFalsy: true })
		.isLength({ max: 20 })
		.withMessage('Please provide a username with less than 20 characters.'),
	check('username')
		.not()
		.isEmail()
		.withMessage('Username cannot be an email.'),
	check('username')
		.isAlphanumeric()
		.withMessage('Username cannot include any symbols.'),
	check('displayName')
		.exists({ checkFalsy: true })
		.isLength({ min: 6 })
		.withMessage('Please provide a display name with at least 6 characters.'),
	check('displayName')
		.exists({ checkFalsy: true })
		.isLength({ max: 30 })
		.withMessage('Please provide a display name of less than 30 characters.'),
	check('password')
		.exists({ checkFalsy: true })
		.isLength({ min: 6 })
		.withMessage('Password must be 6 characters or more.'),
	check('heroClass')
		.exists({ checkFalsy: true })
		.isIn(['Mage', 'Warrior'])
		.withMessage('Must choose one of the two hero classes'),
	handleValidationErrors
];


// Sign up
router.post(
	'/',
	validateSignup,
	async (req, res) => {
		const { email, password, username, displayName, heroClass } = req.body;
		const hashedPassword = bcrypt.hashSync(password);

		const user = await User.create({
			email, username, password: hashedPassword, displayName, heroClass
		});



		let newUserStats;
		let newStat;
		if (user.heroClass === 'Warrior') {
			newUserStats = await userStat.create({
				userId: user.id,
				health: 100,
				experience: 0,
				gold: 500,
				level: 1
			})

			newStat = await Stat.create({
				userId: user.id,
				hp: newUserStats.health,
				strength: 150,
				physicalDefense: 100,
				magic: 50,
				magicDefense: 50,
				luck: 50
			})
		} else if (user.heroClass === 'Mage') {
			newUserStats = await userStat.create({
				userId: user.id,
				health: 100,
				experience: 0,
				gold: 500,
				level: 1
			});

			newStat = await Stat.create({
				userId: user.id,
				hp: newUserStats.health,
				strength: 50,
				physicalDefense: 50,
				magic: 150,
				magicDefense: 100,
				luck: 50
			});
		}

		// Associate userStat and Stat with the user
		// await user.setUserStat(newUserStats);
		// await user.setStat(newStat);
		user.userStat = newUserStats;
		user.Stat = newStat;
		await user.userStat.save();
		await user.Stat.save();

		// Construct the response object
		const safeUser = {
			id: user.id,
			username: user.username,
			displayName: user.displayName,
			email: user.email,
			heroClass: user.heroClass,
			userStats: newUserStats,
			Stats: newStat
		};

		await setTokenCookie(res, safeUser);
		//formulated smooth numbers esp for health until later dev work
		return res
			.status(200)
			.json({ user: safeUser });
	}
);



module.exports = router;
