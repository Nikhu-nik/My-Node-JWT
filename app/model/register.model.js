module.exports = (sequelize, Sequelize) => {
	const Register = sequelize.define('registers', {
	
		fullname: {type: Sequelize.STRING},
		number: {type:Sequelize.STRING},
		profilephoto: { type: Sequelize.STRING },
	 
	  
	
	});
	
	return Register;
}
