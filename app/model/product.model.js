module.exports = (sequelize, Sequelize) => {
	const Product = sequelize.define('product', {


		name: {type: Sequelize.STRING},
	  location:{type: Sequelize.TEXT},
	  price: {type: Sequelize.INTEGER(6)},
		desc: {type: Sequelize.STRING},
	  city: {type: Sequelize.STRING},
		category: {type: Sequelize.STRING},
	  quant: {type: Sequelize.STRING},
		productphone: {type: Sequelize.STRING},
		productfullname: {type: Sequelize.STRING},
		imgbase: {type: Sequelize.TEXT},
		userId: {type: Sequelize.INTEGER(6)},
});
	return Product;
}	