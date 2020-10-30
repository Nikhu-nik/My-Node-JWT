var express = require('express');
var app = express();
cors = require('cors');
var formidable = require('formidable');
var bodyParser = require('body-parser');

// Coverting of base64 image


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({limit: '10000mb', extended: true}))
// parse application/json
app.use(bodyParser.json({limit: '10000mb', extended: true}))



	
app.use(cors({ origin: true }));
global.__basedir = __dirname;


require('./app/routers/router.js')(app);
const db = require('./app/config/db.config.js');
const Role = db.role;
const Category = db.category;
// force: true will drop the table if it already exists
db.sequelize.sync({ alter: true }).then(() => {
	console.log('Drop and Resync with { force: true }');
	initial();
	category();
	
});





 

// Create a Server
var server = app.listen(3000, function () {
	var host = server.address().address
	var port = server.address().port
	console.log("App listening at http://%s:%s", host, port)
	app.get('/', (req, res) => {
		res.send('HEY SERVER IS RUNNING SUCCESSFULLY!')
	});
})

function initial() {
	Role.create({
		id: 1,
		name: "USER"
	});
	Role.create({
		id: 2,
		name: "ADMIN"
	});
}
function category() {
	Category.create({
		id: 1,
		name: "Vegetables"
	});

	Category.create({
		id: 2,
		name: "Fruits"
	});

	
}