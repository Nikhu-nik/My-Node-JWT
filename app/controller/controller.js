const db = require('../config/db.config.js');
const config = require('../config/config.js');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const mime = require('mime');
const fs = require('fs');


//Declaring Databases
const Register = db.register;
const Role = db.role;
const Op = db.Sequelize.Op;
const Product = db.product;
const AddtoCart = db.addtocart;
const Package = db.package;
const PostAdd = db.postadd;


//Register
exports.signup = (req, res) => {
console.log("Processing func -> SignUp");
	Register.create({
		fullname: req.body.fullname,
		number: req.body.number,
		//photo:req.body.photo		

	}).then(Register => {
		Role.findAll({
			where: {
				name: {
					[Op.or]: req.body.roles
				}
			}
		}).then(roles => {
			Register.setRoles(roles).then(() => {
				res.send("User registered successfully!");
					
				});
			
		}).catch(err => {
			res.status(500).send("Error -> " + err);
		});
	}).catch(err => {
		res.status(500).send("Fail! Error -> " + err);
	})
}



//Login
exports.signin = (req, res) => {
	console.log("Sign-In");

	Register.findOne({
		where: {
			number: req.body.number
		}
	}).then(Register => {
		if (!Register) {
			return res.status(404).send('User Not Found.');
		}

		//var passwordIsValid = bcrypt.compareSync(req.body.password, Register.password);
		// if (!passwordIsValid) {
		// 	return res.status(401).send({ auth: false, accessToken: null, reason: "Invalid Password!" });
		// }

		var token = jwt.sign({ id: Register.id }, config.secret, {
			expiresIn: 86400 // expires in 24 hours
		});

		res.status(200).send({ auth: true, accessToken: token });

	}).catch(err => {
		res.status(500).send('Error -> ' + err);
	});



}


//Admin Post Product 
exports.postproduct = (req, res) => {
	// Save User to Database
	console.log("Processing func -> Adding Products");
	let imgbase = req.body.imgbase;
	let filename = "admin-products/" + Date.now().toString() + ".png";
	if (imgbase) {
		let arr = imgbase.split(',');
		//let arrtemp = arr[0].split('/');
		fs.writeFile(filename, arr[1], 'base64', function (err) {
			if (err) {

			}
			else {

			}
		})
	}
	Product.create({
		name: req.body.name,
		desc: req.body.desc,
		category: req.body.category,
		price: req.body.price,
		city: req.body.city,
    imgbase: filename,
		quant: req.body.quant,
		productphone: req.body.productphone,
		productfullname: req.body.productfullname,
		location: req.body.location,
		userId: req.body.userId
	
	}).then(product => {

		res.status(200).json({
			"description": "Admin Posted Product Successfully..!",
			//"product": product
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Admin Failed to Post Product..!",
			"error": err
		});
	})
}

//AWS
// exports.postproduct = (req, res) => {
// 	Save User to Database
// 	console.log("Processing func -> Adding Products");
// 	let imgbase = req.body.imgbase;
//   if(imgbase)
// 	{
// 			let arr = imgbase.split(',');
// 			let arrtemp = arr[0].split('/');
//     fs.writeFile("admin-products/"+Date.now.toString()+".png",arr[1],'base64',function(err)
// 			{
// if(err)
// {

// }
// else{

// }
// 			})
// 	}
// 	Product.create({
// 			name: req.body.name,
// 			desc: req.body.desc,
// 		  category: req.body.category,
// 			price: req.body.price,
// 			city: req.body.city,
// 			imgbase: req.body.imgbase,
// 			quant:req.body.quant,
// 			productphone:req.body.productphone,
// 			productfullname:req.body.productfullname,
// 			userId: req.body.userId,
// 			status: req.body.status

// 	});
// 	res.status(200).json({
// 		"description": "Finally product  with only description",


// 	}).catch(err => {
// 			res.status(500).json({
// 					"description": "Admin Failed to Post Product..!",
// 					"error": err
// 			});
// 	})
// }



//EDit Profile
exports.updateProfile = (req, res) => {
	Register.update(
		{

			fullname: req.body.fullname,
			number: req.body.number,
			profilephoto: req.body.profilephoto
		},
		{ where: { id: req.userId } }
	).then(Register => {
		res.status(200).json({
			"description": Register

		});
	}).catch(err => {
		res.status(500).json({
			"description": "Can not access Management Board",
			"error": err
		});
	})

}



//Get UserList

exports.userList = (req, res) => {
	Register.findAll({
		attributes: ['id', 'fullname', 'number'],
		include: [{
			model: Role,
			attributes: ['id', 'name'],
			through: {
				attributes: ['registerId', 'roleId'],
			}
		}]
	}).then(Register => {
		res.status(200).json({
			//"description": "Admin Board",
			"Register": Register
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Can not access Admin Board",
			"error": err
		});
	})
}



//Get Name of User in sidebar
exports.userview = (req, res) => {
	Register.findOne({
		where: { id: req.userId },
		attributes: ['id', 'fullname', 'number'],
		include: [{
			model: Role,
			attributes: ['name'],

		}]
	}).then(Register => {
		res.status(200).json({
			"description": "User Content Page",
			"Register": Register
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Can not access User Page",
			"error": err
		});
	})
}

//Fetch and display in dashboard
exports.adminpostedproduct = (req, res) => {
	Product.findAll({
		attributes: ['id', 'name', 'price', 'location', 'productphone', 'productfullname',
			'desc', 'city', 'category', 'quant', 'imgbase', 'userId'],
	}).then(product => {
		res.status(200).json({
			"product": product
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Seems some error please check...!",
			"error": err
		});
	})
}

exports.userpostedproduct = (req, res) => {
	PostAdd.findAll({
		attributes: ['id', 'advname', 'advprice', 'advquant', 'advdesc', 'advphone',
			'advcity', 'advfullname', 'advimage',  'userId'],
	}).then(postadd => {
		res.status(200).json({
			"postadd": postadd
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Seems some error with User Mapping please check...!",
			"error": err
		});
	})
}


//Get Products details from Admin AddPro
exports.dashproductList = (req, res) => {
	Product.findAll({

		attributes: ['id', 'name', 'price', 'location', 'productphone', 'productfullname',
			'desc', 'city', 'category', 'quant', 'imgbase', 'userId'],
	}).then(product => {
		res.status(200).json({
			//"description": "Admin Board",
			product
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Can not access Admin Board",
			"error": err
		});
	})
}

//Get User-Profile
exports.profile = (req, res) => {
	res.send('profile uploaded successfully!');

}

//Get product Details

exports.productdetails = (req, res) => {
	var id = req.params.id;
	Product.findOne({
		where: { id: id },
		attributes: ['id', 'name', 'quant', 'city', 'price', 'desc', 'city', 'imgbase', 'userId']

	}).then(product => {
		res.status(200).json({
			"user": product
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Can not access Management Board",
			"error": err
		});
	})
}


//Product Pushing Saving Array
exports.productss = (req, res) => {
	res.status(200).json({
		"description": "Product saved into Folder",


	}).catch(err => {
		res.status(500).json({
			"description": "Can not access Product Page",
			"error": err
		});
	})
}









exports.productList = (req, res) => {
	Product.findAll({

		attributes: ['name', 'price', 'quant', 'desc', 'category', 'image', 'city', 'userId'],
	}).then(product => {
		res.status(200).json({
			//"description": "Admin Board",
			product
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Can not access Admin Board",
			"error": err
		});
	})
}



exports.orderCount = (req, res) => {
	Order.count({
	}).then(order => {
		res.status(200).json({
			order
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Can not access Admin Board",
			"error": err
		});
	})
}



exports.order = (req, res) => {
	// Save User to Database
	// console.log(req);

	Order.create({
		name: req.body.name,
		price: req.body.price,
		image: req.body.image,
		quantity: req.body.quantity,
		userId: req.body.userId,
		total: req.body.total,
		productId: req.body.productId,

	}).then(order => {
		res.status(200).json({
			"description": "order Added",
			"order": order
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Can not access addtocart Page",
			"error": err
		});
	})
}

exports.addproductdetails = (req, file, res) => {

	var type = upload.single('image');
	console.log("req.body is ");
	console.log(req.body);
	var tmp_path = req.file.path;

	/** The original name of the uploaded file
		stored in the variable "originalname". **/
	var target_path = 'uploads/' + req.file.originalname;

	/** A better way to copy the uploaded file. **/
	var src = fs.createReadStream(tmp_path);
	var dest = fs.createWriteStream(target_path);
	src.pipe(dest);
	src.on('end', function () { res.render('complete' + target_path); });
	src.on('error', function (err) { res.render('error'); });

}


exports.addtoCart = (req, res) => {
	// Save User to Database
	console.log("Processing func -> Adding Products");
	AddtoCart.create({
		name: req.body.name,
		price: req.body.price,
		image: req.body.image,
		quantity: req.body.quantity,
		userId: req.body.userId,
		total: req.body.total,
		productId: req.body.productId,

	}).then(addtocart => {
		res.status(200).json({
			"description": "addtocart Added",
			"addtocart": addtocart
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Can not access addtocart Page",
			"error": err
		});
	})
}



exports.editprod = (req, res) => {
	var id = req.params.id;
	Product.findOne({
		where: { id: id },
		attributes: ['id', 'name', 'price', 'quant', 'desc', 'category', 'city', 'image', 'userId'],
	}).then(product => {
		res.status(200).json({
			"user": product
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Can not access Admin Board",
			"error": err
		});
	})
}




exports.BuyPackage = (req, res) => {
	console.log("Processing func -> Packages");
	Package.create({
		packageprice: req.body.packageprice,
		packagetotal: req.body.packagetotal,
		packageId: req.body.packageId,
		userId: req.body.userId
	}).then(package => {
		res.status(200).json({
			package
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Can nt access Package",
			"error": err
		});
	})
}

//Update My New Password?

exports.UpdateNewPassword = (req, res) => {
	Register.findOne({
		where: {
			fullname: req.body.fullname,
		}
	}).then(register => {
		if (!register) {
			return res.status(404).send('User Not Found or not approved.');
		}


		Register.update(
			{
				number: bcrypt.hashSync(req.body.number),

			},
			{ where: { number: req.body.number } }
		).then(Register => {
			res.status(200).json({
				"description": "user",
				"Updated": Register

			});
		}).catch(err => {
			res.status(500).json({
				"description": "Can not access Management Board",
				"error": err
			});
		})
	})
}


//Destroy
exports.destroyUser = (req, res) => {
	var id = req.params.id;
	Register.destroy({
		where: { id: id },
	}).then(Register => {
		res.status(200).json({
			"user": Register
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Can not access Management Board",
			"error": err
		});
	})
}


//USER ADVERTISEMENT

//User Post Product to be saved in to database
exports.postadvertisement = (req, res) => {
	// Save User to Database
	console.log("Processing func -> Adding Products");
	let advimage = req.body.advimage;
	let filename = "user-products/" + Date.now().toString() + ".png";
	if (advimage) {
		let arr = advimage.split(',');
		//let arrtemp = arr[0].split('/');
		fs.writeFile(filename, arr[1], 'base64', function (err) {
			if (err){

			}
			else{

			}
		})
	}
	PostAdd.create({
		advname: req.body.advname,
		advprice: req.body.advprice,
		advquant: req.body.advquant,
		advdesc: req.body.advdesc,
		advcity: req.body.advcity,
		advphone: req.body.advphone,
		advfullname: req.body.advfullname,
		advimage: filename,
		userId: req.body.userId

	}).then(postadd => {

		res.status(200).json({
			"description": "User Posted Product Successfully..!",
			//"postadd": postadd
		});
	}).catch(err => {
		res.status(500).json({
			"description": "User Failed to Post Product..!",
			"error": err
		});
	})
}

exports.Getpostadvertisement = (req, res) => {
	PostAdd.findAll({

		attributes: ['id', 'advname', 'advprice', 'advimage', 'advquant', 'advdesc',
		'advcity','advphone','advfullname','userId'],
	}).then(postadd => {
		res.status(200).json({
			"description": "Got Your Products User...!",
			postadd
		});
	}).catch(err => {
		res.status(500).json({
			"description": " Can't Got Your Products User...!",
			"error": err
		});
	})
}
