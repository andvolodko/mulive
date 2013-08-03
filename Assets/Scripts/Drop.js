var clothes5 : GameObject[];
var clothes10 : GameObject[];
var clothes20 : GameObject[];
var clothes100 : GameObject[];
//var clothes200 : GameObject[];
//var clothes500 : GameObject[];
var clothesAll : GameObject[];
static var drop:boolean=false;
static var toPos:Vector3=Vector3.zero;
static var str:Number=0;
static var dropTime:float=0;
private var arr:GameObject;

function Update () {
	if(drop && Time.time>dropTime) {
		dropi(str,toPos);
		dropTime = 0;
		drop=false;
	}
}

static function item(strength:Number,trans:Vector3) {
	str = strength;
	toPos = trans;
	dropTime = Time.time + 1;
	drop=true;
}

function dropi(strength:Number,trans:Vector3) {
	 if(strength>0 && strength<6) {
		var rnd = Random.Range(0, clothes5.length);	
		arr = clothes5[rnd];
	} 
	 if(strength>5 && strength<11) {
		rnd = Random.Range(0, clothes10.length);	
		arr = clothes10[rnd];
	} 	
	 if(strength>10 && strength<21) {
		rnd = Random.Range(0, clothes20.length);	
		arr = clothes20[rnd];
	} 	
	 if(strength>20 /* && strength<101*/ ) {
		rnd = Random.Range(0, clothes100.length);	
		arr = clothes100[rnd];
	} 	
	 /* if(strength>100 && strength<201) {
		rnd = Random.Range(0, clothes200.length);	
		arr = clothes200[rnd];
	} 		
	 if(strength>200 && strength<501) {
		rnd = Random.Range(0, clothes500.length);	
		arr = clothes500[rnd];
	} 	*/	
	// Some random
	var rnd2 = Random.Range(0, 10);	
	 if(rnd2==2) {
		rnd = Random.Range(0, clothesAll.length);	
		arr = clothesAll[rnd];
	} 			
		var itm = Instantiate(arr, trans, Quaternion.identity );
		itm.GetComponent("Item").drop();	
}
