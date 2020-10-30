module.exports = (sequelize, Sequelize) => {
	const PostAdd = sequelize.define('postadd', {
	
		advname: {type: Sequelize.STRING},
		advprice: {type:Sequelize.STRING},
    advquant: { type: Sequelize.STRING },
		advdesc: { type: Sequelize.STRING },
		advphone: { type: Sequelize.STRING },
		advcity: { type: Sequelize.STRING },
		advfullname: {type:Sequelize.STRING},
		advimage: {type: Sequelize.TEXT}, 
		userId: {type: Sequelize.INTEGER(6)
		},
	
	});
	
	return PostAdd;
}
