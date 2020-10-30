const env = require('./env.js');

 
const Sequelize = require('sequelize');
const sequelize = new Sequelize(env.database, env.username, env.password, {
  host: env.host,
  dialect: env.dialect,
  operatorsAliases: false,
 
  pool: {
    max: env.max,
    min: env.pool.min,
    acquire: env.pool.acquire,
    idle: env.pool.idle
  }
});
 
const db = {};
 
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.sequelize = sequelize;


//Asignment

db.role = require('../model/role.model.js')(sequelize, Sequelize);
db.category = require('../model/category.model.js')(sequelize, Sequelize);
db.register = require('../model/register.model.js')(sequelize, Sequelize);
db.role.belongsToMany(db.register, { through: 'register_roles', foreignKey: 'roleId', otherKey: 'registerId'});
db.register.belongsToMany(db.role, { through: 'register_roles', foreignKey: 'registerId', otherKey: 'roleId'});
db.product = require('../model/product.model.js')(sequelize, Sequelize); 

db.package = require('../model/package.model.js')(sequelize, Sequelize);
db.postadd = require('../model/PostAdd.model.js')(sequelize, Sequelize);
module.exports = db;