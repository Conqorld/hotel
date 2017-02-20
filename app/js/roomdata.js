//export {single,doule,computer};
class room {
	constructor(id,type) {
    this.type = type;
    this.id=id;
    this.status=0;
    this.inittime=null;//开房时间
    this.endtime=null;//实际退房时间
    this.pay=0;//花费
    this.paymethod=0;//0：现金1.微信2.支付宝3.其他
    this.ya=0;//押金
    this.number=0;//人数
    this.other=null;//备注
    this.ixu=false;
    this.exu=false;
  }
}
var single=[
	new room(201,1),
	new room(202,1),
	new room(301,1),
	new room(302,1),
	new room(401,1),
	new room(402,1)
]
var double=[
	new room(203,2),
	new room(205,2),
	new room(206,2),
	new room(303,2),
	new room(305,2),
	new room(306,2),
	new room(403,2),
	new room(406,2)
]
var computer=[
	new room(405,3)
]
var allday=[
	new room(401,3),
	new room(402,3),
	new room(403,3),
	new room(404,3),
	new room(405,3),
	new room(406,3)
]
var aclock=[
	new room(401,3),
	new room(402,3),
	new room(403,3),
	new room(404,3),
	new room(405,3),
	new room(406,3)
]