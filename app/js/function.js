const ipcRenderer = require('electron');
let closeEl =document.querySelector('#close');
closeEl.addEventListener('click', function () {
    ipcRenderer.ipcRenderer.send('close-main-window');
});
let MongoClient = require('mongodb').MongoClient;
let DB_CONN_STR = 'mongodb://localhost:27017/test';    

let insertData = function(db,obj, callback) {  
    //连接到表  
    let collection = db.collection('roomrecord');
    //插入数据
    let data = obj;
    collection.insert(data, function(err, result) { 
        if(err)
        {
            console.log('Error:'+ err);
            return;
        }     
        callback(result);
    });
}

let creat = function(db,obj, callback) {  
    //连接到表  
    let collection = db.collection('room');
    //插入数据
    let data = obj;
    collection.insert(data, function(err, result) { 
        if(err)
        {
            console.log('Error:'+ err);
            return;
        }     
        callback(result);
    });
}

let selectData = function(db, dbname,callback) {  
  //连接到表  
  let collection = db.collection(dbname);
  //查询数据
  
  collection.find().sort({id:-1}).toArray(function(err, result) {
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }     
    callback(result);
  });
}

let selectone = function(db, room,callback) {  
  //连接到表  
  let collection = db.collection('room');
  //查询数据
  let whereStr = {"id":room};
  collection.findOne(whereStr,function(err, result) {
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }     
    callback(result);
  });
}

let updateData = function(db, obj,callback) {  
  //连接到表  
  let collection = db.collection('room');
  //查询数据
  let whereStr = {"id":obj.id};
  let upStr = {$set:obj};
  collection.update(whereStr,upStr,function(err, result) {
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }     
    callback(result);
  });
}

let pageData = function(db,page,callback) {  
  //连接到表  
  let collection = db.collection('roomrecord');
  //查询数据
  let li=20;
  let sk=(page-1)*li;
  collection.find({}, {limit: li, skip:sk}).sort({"_id":-1}).toArray(function(err, result) {
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }     
    console.log(result)
    callback(result);
  });
}

let pageDataSort = function(db,page,callback,start,end) {  
  //连接到表  
  let collection = db.collection('roomrecord');
  //查询数据
  let li=20;
  let sk=(page-1)*li;
  collection.find({inittime:{$gte: start, $lt: end}}, {limit: li, skip:sk}).sort({inittime:-1}).toArray(function(err, result) {
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }     
	callback(result);
  });
}

let counts = function(db,callback) {  
  //连接到表  
  let collection = db.collection('roomrecord');
  //查询数据
  collection.count({},function(err, result) {
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }     
	console.log(result)
    callback(result);
  });
}

let sortcounts = function(db,callback,start,end) {  
  //连接到表  
  let collection = db.collection('roomrecord');
  //查询数据
  collection.count({inittime:{$gte: start, $lt: end}},function(err, result) {
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }     
    callback(result);
  });
}

function findall(dbname,callback) {
	MongoClient.connect(DB_CONN_STR, function(err, db) {
  	console.log("连接成功！");
  	selectData(db,dbname, function(result) {
    callback(result);
    db.close();
  });
});
}
function sortpage(page,callback,start,end) {
	MongoClient.connect(DB_CONN_STR, function(err, db) {
  	console.log("连接成功！");
  	pageDataSort(db,page, function(result) {
    callback(result);
    db.close();
  },start,end);
});
}
function findpage(page,callback) {
	MongoClient.connect(DB_CONN_STR, function(err, db) {
  	console.log("连接成功！");
  	pageData(db,page, function(result) {
    callback(result);
    db.close();
  });
});
}
function findone(room,callback) {
	MongoClient.connect(DB_CONN_STR, function(err, db) {
  	console.log("连接成功！");
  	selectone(db,room, function(result) {
    callback(result);
    db.close();
  });
});
}

function insert(obj,callback){
	MongoClient.connect(DB_CONN_STR, function(err, db) {
    console.log("连接成功！");
    insertData(db,obj, function(result) {
        callback(result);
        db.close();
    });
});
}
function update(obj,callback) {
	MongoClient.connect(DB_CONN_STR, function(err, db) {
    console.log("连接成功！");
    updateData(db,obj, function(result) {
        callback(result);
        db.close();
    });
});
}

function count(callback) {
	MongoClient.connect(DB_CONN_STR, function(err, db) {
    console.log("连接成功！");
    counts(db, function(result) {
        callback(result);
        db.close();
    });
});
}

function tcount(start,end,callback) {
	MongoClient.connect(DB_CONN_STR, function(err, db) {
    console.log("连接成功！");
    sortcounts(db, function(result) {
        callback(result);
        db.close();
    },start,end);
});
}

function init(obj,callback) {
	MongoClient.connect(DB_CONN_STR, function(err, db) {
    console.log("连接成功！");
    creat(db,obj, function(result) {
        callback(result);
        db.close();
    });
});
}
function removeall(callback) {
	MongoClient.connect(DB_CONN_STR,function(err,db){
		//连接到表  
		let collection = db.collection('room');
		collection.remove({}, function(err, result) { 
		    if(err)
		    {
		        console.log('Error:'+ err);
		        return;
		    }     
		    callback();
		});
		db.close();
	})
}
function cloneObj (obj) {  
    var newObj = {};  
    newObj.type = obj.type;
    newObj.id=obj.id;
    newObj.status=obj.status;
    newObj.inittime=obj.inittime;//开房时间
    newObj.endtime=obj.endtime;//实际退房时间
    newObj.pay=obj.pay;//花费
    newObj.paymethod=obj.paymethod;//0：现金1.微信2.支付宝3.其他
    newObj.ya=obj.ya;//押金
    newObj.number=obj.number;//人数
    newObj.other=obj.other;//备注
    newObj.ixu=obj.ixu;
    newObj.exu=obj.exu;
    return newObj;  
}; 
function initObj (obj) {  
    var newObj = {};  
    newObj.type = obj.type;
    newObj.id=obj.id;
    newObj.status=0;
    newObj.inittime=null;//开房时间
    newObj.endtime=null;//实际退房时间
    newObj.pay=0;//花费
    newObj.paymethod=0;//0：现金1.微信2.支付宝3.其他
    newObj.ya=0;//押金
    newObj.number=0;//人数
    newObj.other=null;//备注
    newObj.ixu=false;
    newObj.exu=false;
    return newObj;  
}; 
function sum(start,end,callback) {
	MongoClient.connect(DB_CONN_STR, function(err, db) {
		let collection = db.collection('roomrecord');
		if (start&&end) {
			collection.aggregate([{ $match : { inittime : { $gte : start, $lt : end } } },{$group : {_id : "$by_user", num_tutorial : {$sum : "$pay"}}}], function(err, result) { 
		    if(err)
		    {
		        console.log('Error:'+ err);
		        return;
		    }     
		    callback(result);
		});
		}else{
			collection.aggregate([{$group : {_id : "$by_user", num_tutorial : {$sum : "$pay"}}}], function(err, result) { 
			    if(err)
			    {
			        console.log('Error:'+ err);
			        return;
			    }     
			    callback(result);
			});
		}
		db.close();
	})
}
function roomsum(start,end,callback) {
	MongoClient.connect(DB_CONN_STR, function(err, db) {
		let collection = db.collection('roomrecord');
		if (start&&end) {
			collection.aggregate([{ $match : { inittime : { $gte : start, $lt : end } } },{$group : {_id : "$id",count:{$sum : 1}, sum : {$sum : "$pay"}}},{ $sort : {_id:1} }], function(err, result) { 
		    if(err)
		    {
		        console.log('Error:'+ err);
		        return;
		    }     
		    callback(result);
		});
		}else{
			collection.aggregate([{$group : {_id : "$id",count:{$sum : 1}, sum : {$sum : "$pay"}}},{ $sort : {_id:1} }], function(err, result) { 
			    if(err)
			    {
			        console.log('Error:'+ err);
			        return;
			    }     
			    callback(result);
			});
		}
		db.close();
	})
}
function typesum(start,end,callback) {
	MongoClient.connect(DB_CONN_STR, function(err, db) {
		let collection = db.collection('roomrecord');
		if (start&&end) {
			collection.aggregate([{ $match : { inittime : { $gte : start, $lt : end } } },{$group : {_id : "$type",count:{$sum : 1}, sum : {$sum : "$pay"}}},{ $sort : {_id:1} }], function(err, result) { 
		    if(err)
		    {
		        console.log('Error:'+ err);
		        return;
		    }     
		    callback(result);
		});
		}else{
			collection.aggregate([{$group : {_id : "$type",count:{$sum : 1}, sum : {$sum : "$pay"}}},{ $sort : {_id:1} }], function(err, result) { 
			    if(err)
			    {
			        console.log('Error:'+ err);
			        return;
			    }     
			    callback(result);
			});
		}
		db.close();
	})
}
function statussum(start,end,callback) {
	MongoClient.connect(DB_CONN_STR, function(err, db) {
		let collection = db.collection('roomrecord');
		if (start&&end) {
			collection.aggregate([{ $match : { inittime : { $gte : start, $lt : end } } },{$group : {_id : "$status",count:{$sum : 1}, sum : {$sum : "$pay"}}},{ $sort : {_id:1} }], function(err, result) { 
		    if(err)
		    {
		        console.log('Error:'+ err);
		        return;
		    }     
		    callback(result);
		});
		}else{
			collection.aggregate([{$group : {_id : "$status",count:{$sum : 1}, sum : {$sum : "$pay"}}},{ $sort : {_id:1} }], function(err, result) { 
			    if(err)
			    {
			        console.log('Error:'+ err);
			        return;
			    }     
			    callback(result);
			});
		}
		db.close();
	})
}
function timeFind(time,callback) {
	MongoClient.connect(DB_CONN_STR, function(err, db) {
		let collection = db.collection('roomrecord');
		if (time) {
			collection.find({inittime:{$gte: time}}).sort({inittime:-1}).toArray(function(err, result) {
				if(err)
				{
					console.log('Error:'+ err);
					return;
				}     
				callback(result);
			})
		}else{
			collection.find({}).sort({inittime:-1}).toArray(function(err, result) {
				if(err)
				{
					console.log('Error:'+ err);
					return;
				}     
				callback(result);
			})
		}
		db.close();
	})
}