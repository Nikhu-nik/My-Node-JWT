module.exports = (sequelize, Sequelize) => {
	const Package = sequelize.define('package', {
		packageprice: { type: Sequelize.Sequelize.STRING },
		packagetotal: { type: Sequelize.STRING },
		// packagetype: { type: Sequelize.STRING },
	  packageId: { type: Sequelize.STRING },
		userId: { type: Sequelize.STRING }
	});
	return Package;
}