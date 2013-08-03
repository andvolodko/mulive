var war:boolean=false;
var enemy:GameObject;


function Update () {
}

static function test() {
	print("test");
}

// Triggers
function OnTriggerEnter (other : Collider) {
	if(other.name=="Player" && !RPG_player.isDied) {
	//print("war");
	war=true; enemy=other.gameObject; }
}

function OnTriggerExit(other : Collider) {
	if(other.name=="Player") {
	//print("no war");
	war=false; enemy=null; }
}
