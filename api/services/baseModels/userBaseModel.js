module.exports = {
	attributes: {
		name: {
			type: 'string',
			required: true
		},
		email: {
			type: 'email',
			required: true,
			unique: true
		}
	}
}