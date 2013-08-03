/////////////// Vars
var speed = 2;
var run_speed = 2;
var jumpSpeed = 2.0;
var gravity = 0.6;
static var strength = 20.0; // kick strength 
static var addStr=0;
static var defense = 0.0; // defense
static var addDef=0;
static var kickRate:float = 2; // kick speed
static var addKr=0;
public var Hero:GameObject; 
var gtext: GUIText ; 
var kickSound1 : AudioClip;
var kickSound2 : AudioClip;
var kickSound3 : AudioClip;
var hitSound1 : AudioClip;
var dieSound : AudioClip;
var walkSoil : AudioClip;
private var tmpWalkTime:float=0.5;
private var walkTime:float=0.5;
private var nextWalkTime:float=0;
private var moveDirection = Vector3.zero;
private var movePosition = Vector3.zero;
private var grounded : boolean = false;
private var timer:float=0;
private var isMove:boolean=false;
private var isRun:boolean=false;
private var isAttack:boolean=false;
static var isKicked:boolean=false;
static var isMiss:boolean=false;
static var isDied:boolean=false;
static var level:int =0;
static var exp:int=0;
static var money:int =0;
static var health:float =100;
static var maxHealth:float =100;
static var mana:float =100;
static var maxMana:float =100;
static var enemy:GameObject=null;
private var timerAnim:float=0;
private var nameAnim;
private var nextKickAnim:float=0;
private var nextKick:float = 0.0; 
private var kickAnimTime:float=0.5;
private var restoreTime:float = 0.0; 
private var controller : CharacterController;
static var item:GameObject=null;
static var animKickName="";

///////// Functions
function Start() {
	movePosition = transform.position;
	controller = GetComponent(CharacterController);
	//Animation
	// Make all animations in this character play at half speed
	for (var state : AnimationState in Hero.animation) {
	state.speed = 0.2;
	}
	//TODO
	//Camera.main.rect = Rect (0,0,0.5,1);
	gtext.material.color = Color(1,0,0.04,0);

}

function FixedUpdate() {
	
	// For health title
	if(gtext.material.color.a>0)  gtext.material.color.a -=0.8*Time.deltaTime;

	// For rotate and move
	var ray = Camera.main.ScreenPointToRay (Input.mousePosition);
	var hit : RaycastHit;
	Physics.Raycast (ray, hit, 200);
	//print(hit.point.x+" "+Hero.transform.position.x );

	// Rotate to cursor
	if(!isMove && !isRun  && mouse_in() && !isDied && !isKicked && !isAttack) turn_to(hit.point);

	//Go item
	if(item!=null && !isDied) {
		go_to(item.transform.position);
		if(Vector3.Distance(transform.position,item.transform.position)<4) {		
		Inventory3D.addItem(item);
		item=null; }
	}

	//GOTO
	if(Input.GetMouseButton (0) && mouse_in() && !isDied && !isKicked && Time.time>timerAnim  && enemy==null) { 
		go_to(hit.point);
	//print("go");
	} 
	step();
	if (grounded) {
		if (Input.GetButton ("Jump")) {
			moveDirection.y = jumpSpeed;	
		}
	}


	//Animation
	if(enemy!=null && !isDied) {
		var warK = enemy.GetComponent("Monster").warK;	
		if(!warK ) { go_to(enemy.transform.position); 	}
		else { //kick enemy
			turn_to(enemy.transform.position);
			moveDirection=Vector3.zero;
			if(animKickName =="") go_anim_queue("kick1",1);  else go_anim_queue(animKickName,1); 
			if (Time.time > nextKick  ) {
				nextKick = Time.time + kickRate;
				//go_anim("kick1");
				//audio.PlayOneShot(attackSound);
				nextKickAnim=Time.time+kickAnimTime;
				var ekick = enemy.GetComponent(Monster);
				ekick.kick( strength+addStr );
				audio.PlayOneShot(hitSound1);
			} 
 }
	}	
	if(isKicked && Time.time>timerAnim && !isDied) {
		if(!isMiss) {
			go_anim_queue("hit",0.3); 
			var rnd = Random.Range(1, 3);
			if(rnd==1) audio.PlayOneShot(kickSound1);
			if(rnd==2) audio.PlayOneShot(kickSound2);
			if(rnd==3) audio.PlayOneShot(kickSound3);
		}
		isKicked=false;		
	}
	if(health<=0) { health=0; go_anim("died1");  
		if(!isDied) { 
		audio.PlayOneShot(dieSound); 
		controller.detectCollisions = false;
		isDied=true;
		restoreTime = Time.time + 3; // For restore
		}
	 }	
	anim_queue();
	
	
	
	//MOVE
	// Apply gravity
	moveDirection.y -= gravity * Time.deltaTime;	
	if(transform.position.y<0) transform.position.y=6;
	
	// Move the controller
	var flags = controller.Move(moveDirection * Time.deltaTime);
	grounded = (flags & CollisionFlags.CollidedBelow) != 0;
		
	if(restoreTime>0 && Time.time>restoreTime) {
		restore();
		restoreTime=0;
	}
	
}

function go_to(to:Vector3) {		
		isMove=true;	
		go_anim("go"); 
		movePosition=to;
		moveDirection=to;
		// We are grounded, so recalculate movedirection directly from axes
		moveDirection = new Vector3(to.x-transform.position.x , 0, to.z-transform.position.z);
		moveDirection.Normalize(); 
		moveDirection.Scale( Vector3(2,2,2) ); 
		moveDirection *= speed;
		if(isRun) { go_anim("run");   moveDirection *= run_speed; }
		//print(moveDirection);
		turn_to(to);
}

function step() {
//Debug.DrawRay (Hero.transform.position, moveDirection, Color.red);
	if(isMove) { 
	go_to(movePosition);
	timer += Time.deltaTime;	
	if(Time.time>nextWalkTime && Time.time>timerAnim) { audio.PlayOneShot(walkSoil); nextWalkTime = Time.time+tmpWalkTime; }
		if(timer>3 && !isRun) { 
		go_anim("run");  moveDirection *= run_speed; isRun=true; tmpWalkTime =walkTime*0.8; }
	} else {
	go_anim("stay");
	isRun=false; timer=0; tmpWalkTime =walkTime;
	}
	if(Mathf.Round(transform.position.x)==Mathf.Round(movePosition.x) && Mathf.Round(transform.position.z)==Mathf.Round(movePosition.z) ) 
	{ isMove = false; moveDirection=Vector3.zero; movePosition = transform.position;}
	if(Vector3.Distance(movePosition,Vector3(movePosition.x,transform.position.y,movePosition.z) )   >2 )
	{ isMove = false; moveDirection=Vector3.zero; movePosition = transform.position;}
	//print(transform.position.x+";"+movePosition.x);
}

function turn_to(to:Vector3) {
Hero.transform.LookAt(to);
Hero.transform.eulerAngles.x=-90;
}

function go_anim(anim:String) {
	Hero.animation.CrossFade (anim);
}
function go_anim_queue(anim,time_to) {
	if(Time.time>timerAnim ) { nameAnim=anim; timerAnim = Time.time*1.0+time_to*1.0;	}
}
function anim_queue() {
	if(Time.time<timerAnim){ 
	Hero.animation.CrossFade (nameAnim);
	moveDirection=Vector3.zero; 
	} 
}
function kick(val) {
		var toDef = (((defense+addDef)*4)/(val*1.0))*0.01; print(toDef);
		if(toDef<1) val = val - (val * 1.0 * toDef);
		val = Mathf.Round(val);       
		if(val<0) val=0;
		health -=1.0*val ;
		//print("kick"+val);		
		isKicked=true;
		if(val == 0) {
			gtext.text = Lng.geet(500);
			isMiss  = true;
		} else { 
			gtext.text = "-"+val.ToString(); // health label			
			isMiss  = false;
		}	
		gtext.material.color.a = 1.0;
}
// Add health
function doctor(val) {
		health +=1.0*val;
		if(health>maxHealth) health = maxHealth;
}
// Restore player
function restore() {
	transform.position.x = 254;
	transform.position.y = 5;
	transform.position.z = 199;
	health = maxHealth;
	exp=0;
	controller.detectCollisions = true;
	isDied=false;	
}

function addExp(val) {
	exp +=val;
}

function OnCollisionStay (other : Collision) {
	if(isDied) Physics.IgnoreCollision(collider, other.collider);
}

//etc
static function mouse_in() {
// TODO not in inventar etc
	if( (Input.mousePosition.x > 0 &&Input.mousePosition.x <Camera.main.pixelWidth) && (Input.mousePosition.y > Camera.main.pixelRect.yMin &&Input.mousePosition.y <Camera.main.pixelHeight+Camera.main.pixelRect.yMin ) )
	return true; else return false;	
}

@script RequireComponent(CharacterController)