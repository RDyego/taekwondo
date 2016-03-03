/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var bcrypt = require('bcryptjs');


module.exports = {
	'new': function (req, res) {
		res.view('session/new', { layout: null });
	},

	create: function (req, res, next) {
		// Check for email and passwoard in params sent via the form, if none
		// redirect the broser back to the sign-in form
		if (!req.param('email') || !req.param('password')) {
			// return next({err: ["Email or Password is missing."]});
			var usarnamePasswordRequiredError = [{ name: 'usarnamePasswordRequired', message: 'You must entre both a username and password' }];
			// Remember that err is the object being passed down (a.k.a flash.err), whose value is another object with
			// the key of usernamePasswordRequiredError
			req.session.flash = {
				err: usarnamePasswordRequiredError
			}
			res.redirect('/session/new');
			return;
		}
		
		// Try to find the user by there email adress.
		// findOneByEmail() is a dynamic finder in that it searches the model by a particular attribute
		User.findOneByEmail(req.param('email'), function (err, user) {
			if (err) return next(err);

			if (!user) {
				var noAccountError = [{ name: 'noAccount', message: 'The email adress ' + req.param('email') + 'not found.' }];
				req.session.flash = {
					err: noAccountError
				}
				res.redirect('/session/new');
				return;
			}
			
			// Compare password from the form params to the encrypted password of the user found.
			bcrypt.compare(req.param('password'), user.encryptedPassword, function (err, valid) {
				if (err) return next(err);
				if (!valid) {
					var usernamePasswordMismatchErro = [{ name: 'usarnamePasswordMismath', message: 'Invalid username and password combination.' }];
					req.session.flash = {
						err: usernamePasswordMismatchErro
					}
					res.redirect('/session/new');
					return;
				}
				
				// Log user in
				req.session.authenticated = true;
				req.session.User = user;

				return res.redirect('/');
			});
		});
	},

	destroy: function (req, res, next) {
		User.findOne(req.session.User.id, function foundUser(err, user) {
			var userId = req.session.User.id;
			// The user is "logging out" (e.g. destroying the session) so change the online atribute to false
			User.update(userId, { online: false }, function (err) {
				if (err) return next(err);
				// Wipe out the session (log out)
				req.session.destroy();
				
				// Redirect the browser to the sign-in screen
				res.redirect('/session/new');
			});
		});
	}
};
