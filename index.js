/**
 * Loops through a CSV file and inserts the 
 * rows one by one into mongo
 *
 * You can do this more efficienty by buildig
 * the query up and inserting it which would 
 * make it much faster than this but I was thinking
 * if the data is being fed into this db in real
 * time by the car, the majority of the data 
 * is probably coming in row by row and that kind
 * of optimisation probably wouldn't be possible(?)
 *
 * For more on that other approach:
 * http://vladmihalcea.com/2013/12/01/mongodb-facts-80000-insertssecond-on-commodity-hardware/
 */

var csv = require("fast-csv");
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/TeamArrow');
var db = mongoose.connection;

var dataSchema = mongoose.Schema({
    ID: String,
    foo: String,
    bar: String,
})

var dataPoint = mongoose.model('dataPoint', dataSchema)

var rowCount = 0;
var attrCount = 0;

console.log("Reading csv file and inserting into mongo");

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {

	console.time('mongo_speed');

	csv.fromPath("demodata.csv")
	.on("data", function(data){
	

		var row = new dataPoint({ ID: data[0], foo: data[1], bar: data[2]})
	
		row.save(function (err, row) {
			if (err) return console.error(err);
			// console.log(row);
			rowCount++;
			attrCount = attrCount + 3;

		});

 	})
 	.on("end", function(){
    	console.log("done");
    	console.log("inserted " + rowCount + " rows containing " + attrCount +" attributes");
    	console.timeEnd('mongo_speed');
 	});


});
