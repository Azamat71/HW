var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var path = require("path");
var mysql = require('mysql');
var con = mysql.createConnection({
		host: "localhost",
  	user: "root",
  	password: "",
  	database: "crud"
});
con.connect(function(err){
	if(err) throw err;
	console.log("Connected")
});
app.set('Views', path.join(__dirname,'Views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
var obj = {};

//All users
app.get('/', (req,res) => {
		con.query('select * from info', function(err, result){
				if (err) throw err;
				else{
					obj = {print:result};
					res.render('index', obj);
				}
		});
});

//Add User
app.get('/add', (req, res) => {
	res.render('add');
})
app.post('/add', (req, res) => {
	con.query('INSERT INTO info (name, address, email) VALUES (?,?,?)', [req.body.name, req.body.address, req.body.email], (err, result) => {
		if(err) throw err;
		else
			res.send('Succesfully added user: ' + req.body.name + ' ' + req.body.address + ' ' + req.body.email);
	});
});

//Update user
app.get('/update/:id', (req, res) => {
	con.query('SELECT * FROM info WHERE id=?', [req.params.id], (err, result) => {
		res.render('up', {updated: result});
	})
})
app.post('/update/:id', (req, res) => {
	con.query('UPDATE info SET name=?, address=?, email=? where id=?', [req.body.name, req.body.address, req.body.email, req.params.id], (err, result) => {
		if(err) throw err;
		else
			res.send('Successfully updated user with id: ' + req.params.is)
	});
});

// Delete
app.get('/delete/:id', (req, res) => {
	con.query('DELETE FROM info WHERE id = ?', [req.params.id], (err, result) => {
    if (err) throw err;
    else
      res.send('Succesfully deleted user with id: '+req.params.id);
    });
});

app.listen(8000, () => {
  console.log('Server is running at port 8000');
});
