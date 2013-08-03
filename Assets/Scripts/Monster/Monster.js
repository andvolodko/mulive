var speed:float = 2;
var run_speed = 2;
var jumpSpeed = 2.0;
var gravity = 0.6;
var lookRange = 5;
var exp:int =100;
var health:float =100;
var maxHealth:float =100;
var mana:float =100;
var maxMana:float =100;
var strength = 5; // kick strength 
var kickRate:float = 2; // kick speed
var warL:boolean = false;
var warK:boolean = false;
var pparticleEmitter:ParticleEmitter ;
var goObj:GameObject;
var screamSound:AudioClip;
var attackSound:AudioClip;
var dieSound:AudioClip;
var gtext: GUIText ; 
var Monster : GameObject;
var lngName : int=0;
var lblSkin : GUISkin;
public var isKicked:boolean=false;
public var isDied:boolean=false;
private var timer:float;
private var timerGo:float;
private var timerLook:float;
private var stayPos:Vector3=Vector3.zero;
private var moveDirection = Vector3.zero;
private var movePosition = Vector3.zero;
private var grounded : boolean = false;
private var isMove:boolean=false;
private var isRun:boolean=false;
private var isAttack:boolean=false;
private var canAttack:boolean=false; //
private var inStayPos:boolean=true;
private var kickAnim:boolean=false;
private var kickAnimTime:float=0.5;
private var nextKickAnim:float=0;
private var rnd:float ;
private var lookTime:float = 4;
private var lookTimeAnim:float = 1;
private var controller : CharacterController;
private var nextKick:float = 0.0; 
private var timerAnim:float=0;
private var nameAnim;
private var nextCheck:float=0.5;
private var timeCheck:float=0.0;
private var Hero:GameObject;
private var isLive = false;
private var showName:boolean=false;
private var tmpMaterials : Array ;
private var tmpMaterials2 : Array ;
private var enemy : Vector3 ;
private var tmpTexture : Texture2D ;
///////// Functions
function Start() {
	controller = GetComponent(CharacterController);
	//Animation
	// Make all animations in this character play at half speed
	for (var state : AnimationState in animation) {
	state.speed = 0.5;
	}
	goObj.transform.position.x += lookRange;
	stayPos=transform.position;
	rnd = Random.Range(2, 6);	
	movePosition = transform.position;		
	Hero=GameObject.FindWithTag("Player");
	gtext.material.color = Color(0.2,0.6,1,0);
	// Save materials
	tmpMaterials = new Array();
	tmpMaterials2 = new Array();
	for (var  mat : Material in Monster.renderer.materials)
	{
		tmpMaterials.Add(mat.shader.name);
		if( mat.HasProperty("_Color") ) tmpMaterials2.Add(mat.color.a); else tmpMaterials2.Add(0); 
	}		
	tmpTexture = new Texture2D (300, 20, TextureFormat.ARGB32, false);	
}

function FixedUpdate() {

live();

if(isLive) {

	if(!RPG_player.isDied) {
		if(Vector3.Distance(transform.position,Hero.transform.position)<lookRange ) { warL=true; enemy = Hero.transform.position;} else { warL=false; }
		if(Vector3.Distance(transform.position,Hero.transform.position)<2 ) { warK=true; enemy = Hero.transform.position;} else {warK=false; }
	}	
	if(gtext.material.color.a>0)  gtext.material.color.a -=0.8*Time.deltaTime;

if(warL && !RPG_player.isDied && !isDied) { 
	//print("war"); Destroy (gameObject); 
	if(warL && !warK ) go_to(enemy); 
	//print("wwar");
	if (Time.time > nextKick && warK && !isDied) {
		moveDirection=Vector3.zero;
		nextKick = Time.time + kickRate;
		pparticleEmitter.emit = true;
		go_anim("attack"); 
		audio.PlayOneShot(attackSound);
		nextKickAnim=Time.time+kickAnimTime;
		GameObject.Find("Player").GetComponent("RPG_player").kick( strength );
	} 
} 

if( Time.time>nextKickAnim ) {
	pparticleEmitter.emit = false;
	if(!isDied) go_anim("stay"); 
}

// scream rnd
timer += Time.deltaTime;
if(timer>rnd) { 
	if(!warL && !isDied) audio.PlayOneShot(screamSound); 
	timer=0; 
	rnd = Random.Range(4, 6);
}

	if(isKicked) {
		go_anim_queue("hit",1.0); 
		//audio.PlayOneShot(kickSound);
		gtext.material.color.a = 1.0;
		isKicked=false;
	}
	if(health<=0) { 
		health=0; go_anim("die");  
			if(!isDied) { 
			audio.PlayOneShot(dieSound); 
			RPG_player.enemy = null;
			GameObject.Find("Player").GetComponent("RPG_player").addExp(exp);
			isDied=true; 
			Cursor.attackGlobal=false;
			//print("over");
			for (var  mat : Material in Monster.renderer.materials)
			{
				mat.shader = Shader.Find( "Diffuse" );
			}					
			Physics.IgnoreCollision(GameObject.Find("Player").collider, collider);
			Drop.item(strength,transform.position);
			Destroy (gameObject, 5);
			}
	}	
	anim_queue();
	// Apply gravity
	moveDirection.y -= gravity * Time.deltaTime;	
	// Move the controller	
	var flags = controller.Move(moveDirection * Time.deltaTime);
	grounded = (flags & CollisionFlags.CollidedBelow) != 0;

	if(!warK && !isDied) step();

	}
}


function go_to(to:Vector3) {
		isMove=true;	
		go_anim("run"); 
		movePosition=to;
		// We are grounded, so recalculate movedirection directly from axes
		moveDirection = new Vector3(to.x-transform.position.x , 0, to.z-transform.position.z);
		moveDirection.Normalize(); 
		moveDirection.Scale( Vector3(2,2,2) ); 
		moveDirection *= speed;
		turn_to(to);
}

function step() {
Debug.DrawRay (transform.position, moveDirection, Color.red);
if(!isMove) { timerGo += Time.deltaTime; }
go_anim("run"); 
	if(timerGo>lookTime && !isMove) { 
		isMove = true; 
		 if(inStayPos) {  
		 inStayPos = false;
		 transform.Rotate( Vector3(0,0,Random.Range(0, 360)) );
		 movePosition=goObj.transform.position;
		 //print(movePosition+":"+transform.position);
		 } else {
		 inStayPos = true;
		 movePosition = stayPos;
		 }		 		 
		 timerGo=0; 
		 }
	go_to(movePosition);
	if(Mathf.Round(transform.position.x)==Mathf.Round(movePosition.x) && Mathf.Round(transform.position.z)==Mathf.Round(movePosition.z) ) 
	{ isMove = false;  look(); moveDirection=Vector3.zero; }
}

function look() {
		if(!isMove) { go_anim("look");  /* yield WaitForSeconds (lookTimeAnim);  go_anim("stay"); */ }
}

function turn_to(to:Vector3) {
	transform.LookAt(to);
	transform.eulerAngles.x=-90;
}

function go_anim(anim:String) {
	animation.CrossFade (anim);
}
function go_anim_queue(anim,time_to) {
	if(Time.time>timerAnim ) {nameAnim=anim; timerAnim = Time.time*1.0+time_to*1.0;	}
}
function anim_queue() {
	if(Time.time<timerAnim){ 
	animation.CrossFade (nameAnim);
	moveDirection=Vector3.zero; 
	}
}
function kick(val) {
		health -=1.0*val;
		//print("kick"+val);
		isKicked=true;
		gtext.text = "-"+val.ToString(); // health label
}


function live() {
//print(Vector3.Distance(transform.position,Hero.transform.position));
	if(Time.time>timeCheck) {		
		timeCheck = Time.time +nextCheck;
		if(Vector3.Distance(transform.position,Hero.transform.position)<10 )
		isLive = true; else isLive = false;
	}	
}

// Fades the red component of the material to zero
// while the mouse is over the mesh
function OnMouseOver () {
//renderer.material.color.r -= 0.1 * Time.deltaTime;
	if(!isDied) { 
	showName=true;
	Cursor.attackGlobal=true; 
	for (var  mat : Material in Monster.renderer.materials)
	{
		mat.shader = Shader.Find( "Toon/Basic Outline" );
	}	
	//print("over");
	}
}
// Fades the red component of the material to zero
// while the mouse is over the mesh
function OnMouseExit () {
if(!isDied) {
Cursor.attackGlobal=false;
//print("over");
var i:int=0; 
for (var  mat : Material in Monster.renderer.materials)
{
	mat.shader = Shader.Find( tmpMaterials[i] );
	i++;
}
}
showName=false;
}

function OnMouseDown  () {
	if(!isDied) RPG_player.enemy = gameObject;
	print("set");
}

function OnMouseUp  () {
	RPG_player.enemy = null;
	print("upset");
}

function OnCollisionEnter (other : Collision) {
	if(isDied) Physics.IgnoreCollision(collider, other.collider);
}

function OnGUI() {
	if(showName)  { 
		GUI.skin = lblSkin;	
		var tmpStyle = new GUIStyle();
		tmpStyle.normal.textColor = Color(0.35,0.75,0.94);
		var percent:float = (300*(health*100/maxHealth))/100;
		for (y=0; y < tmpTexture.height; ++y) {
		for (x=0; x < tmpTexture.width; ++x) {
			var col = Color(0.5,0,0,0.3);		
			if(x<percent) col = Color(0.5,0,0,1);
			tmpTexture.SetPixel (x, y, col );
		}
		}
		tmpTexture.Apply();
		tmpStyle.normal.background = tmpTexture;
		tmpStyle.alignment = TextAnchor.UpperCenter;
		GUI.Label (Rect ((Screen.width*0.5)-150, 0, 300, 20), Lng.geet(lngName),tmpStyle ); 	
	}
}

@script RequireComponent(CharacterController)
@script RequireComponent(AudioSource)