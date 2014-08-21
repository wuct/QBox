var _ = require('lodash');
var fs = require('fs');

var data = fs.readFileSync('./q-box-anonymous_users-export.json', 'utf8');
// console.log(data);
data = JSON.parse(data);

var json2csv = require('json2csv');
var userList = [];
_.forEach(data, function(val, id) {
	// { createdAt: '2014-08-14T08:57:33.390Z',
	//  email: 'favorjean@gmail.com',
	//  note: '交通工具:機車 單車 火車',
	//  phone: '0975565074',
	//  type: 'agent',
	//  vehicle: '其他',
	//  zip: '205' }

	// console.log(val);
	userList.push(val);
});

json2csv({data: userList, fields: ['createdAt', 'email', 'note', 'phone', 'type', 'zip', 'vehicle']}, function(err, csv) {
  if (err) console.log(err);
  fs.writeFile('userList.csv', csv, function(err) {
    if (err) throw err;
    console.log('file saved');
  });
  console.log(csv);
});





