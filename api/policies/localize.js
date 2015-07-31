module.exports = function (req, res, next) {
	//req.locale=req.param('lang');
	req.locale = 'br';
	next();
};