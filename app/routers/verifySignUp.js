const db = require('../config/db.config.js');
const config = require('../config/config.js');
const ROLEs = config.ROLEs; 

const Role = db.role;
const Register = db.register;
checkDuplicateUserNameOrEmail = (req, res, next) => {
	// -> Check Username is already in use
	
		
		// -> Check Email is already in use
		Register.findOne({ 
			where: {
			fullname: req.body.fullname
			} 
		}).then(Register => {
			if(Register){
				res.status(400).send("Fail -> Email is already in use!");
				return;
			}
				
			next();
		});
	
}

checkRolesExisted = (req, res, next) => {	
	for(let i=0; i<req.body.roles.length; i++){
		if(!ROLEs.includes(req.body.roles[i].toUpperCase())){
			res.status(400).send("Fail -> Does NOT exist Role = " + req.body.roles[i]);
			return;
		}
	}
	next();
}

const signUpVerify = {};
signUpVerify.checkDuplicateUserNameOrEmail = checkDuplicateUserNameOrEmail;
signUpVerify.checkRolesExisted = checkRolesExisted;

module.exports = signUpVerify;
