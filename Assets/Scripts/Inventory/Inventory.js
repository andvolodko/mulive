var invSkin : GUISkin;
var barSkin : GUISkin;
var healthTx : Texture2D;
var manaTx : Texture2D;
var invTx1 : Texture2D;
var invTx2 : Texture2D;
var invCam: Camera;
var iWindow : AudioClip;
var muButton : GUIStyle;
private var invTxTmp : Texture2D;
private var keyRate:float = 0.2;
private var nextFire:float = 0.0; // Show invent rate
private var updateDipRate:float = 0.5;
private var nextDip:float = 0.0; 
private var nextFPS:float = 0.0; 
private var showInvent:boolean = false;
private var showChr:boolean = false;
private var invRect = Rect (0, 0, 190, 433);
private var chrRect = Rect (0, 0, 190, 433);
private var bottRect = Rect (0, 0, 640, 93);
private var tmpHealth:float = 0;
private var tmpMana:float = 0;
private var fps:float = 0;
private var fps_val:float = 0;
private var tmpResolution: Vector2;
private var tmpStyle:GUIStyle;

function Start() {
tmpResolution = Vector2(Screen.width,Screen.height);
OnResize();
tmpStyle = new GUIStyle();
tmpStyle.normal.textColor = Color(0.98,0.83,0);	
}

function Update () {

if(tmpResolution != Vector2(Screen.width,Screen.height) ) OnResize();

//FPS
fps++;
if (Time.time > nextFPS) {
nextFPS = Time.time + 1;
fps_val = fps;
fps=0;
} 

//INVENTAR SHOW/HIDE
if (Input.GetKey (KeyCode.I ) && Time.time > nextFire) {
	shI();
} 

//Character SHOW/HIDE
if (Input.GetKey (KeyCode.C ) && Time.time > nextFire) {
	chI();
} 

//Tst full
if (Input.GetKey (KeyCode.F ) && Time.time > nextFire) {
	Screen.fullScreen = !Screen.fullScreen;
	nextFire = Time.time + keyRate;
} 

// UPDATE HEALTH MANA
	if(Time.time >nextDip) {
		if(tmpHealth!=RPG_player.health) {
			sset_dip(RPG_player.maxHealth-RPG_player.health*100/RPG_player.maxHealth,healthTx);
		}
		if(tmpMana!=RPG_player.mana) {
			sset_dip(RPG_player.maxMana-RPG_player.mana*100/RPG_player.maxMana,manaTx);
		}		
		tmpHealth = RPG_player.health;
		tmpMana = RPG_player.mana;
		nextDip = Time.time + updateDipRate;
	}

}

function check_cam_rect() {
	if( !showChr && !showInvent) Camera.main.rect = Rect (0, 0.1, 1, 1); 
	if( showChr && showInvent) Camera.main.rect = Rect (0, 0.1, 0.42, 1);
	if(!showChr && showInvent) Camera.main.rect = Rect (0, 0.1, 0.7, 1);
	if( showChr && !showInvent) Camera.main.rect = Rect (0, 0.1, 0.7, 1);
}

function shI() {
	nextFire = Time.time + keyRate;
	showInvent=!showInvent;
	check_cam_rect();
	audio.PlayOneShot(iWindow);
}
function chI() {
	nextFire = Time.time + keyRate;
	showChr=!showChr;
	check_cam_rect();
	audio.PlayOneShot(iWindow);
}

function OnGUI () {
var tScale = Vector3(1.0*Screen.width/960, 1.0*Screen.width/720, 1.0);
var tMatrix = Matrix4x4.TRS(Vector3(0, 0, 0),  Quaternion.identity, tScale);
GUI.matrix = tMatrix; 
chrRect = Rect(675,0,285,470);
bottRect = Rect(0,402,960,140);
//print(Input.mousePosition);
if(showInvent)  { 
	GUI.skin = invSkin;	
	//if(showChr)  invRect = resize(190,433,190, Screen.height-Screen.height*0.1,"right2",0,0); 
	//	else invRect = resize(190,433,190, Screen.height-Screen.height*0.1,"right",0,0); 
	//invRect = GUI.Window (2, invRect, DoInvWindow, "Инвентарь" );	
	invCam.rect = Rect (0.0, 0, 1, 1); 	
	if(showChr)  {
		invCam.transform.localPosition.x=-4;
		GUI.Label (Rect ( 500, 6, 100, 25), Lng.geet(3));
		if(GUI.Button (Rect (413,443,24,24), "",muButton )) {	
			shI();
		}		
		GUI.Label (Rect (480,425,300,20), RPG_player.money.ToString(),tmpStyle);
	} else {
		invCam.transform.localPosition.x=-23.5;	
		GUI.Label (Rect ( 800, 6, 100, 25), Lng.geet(3));
		if(GUI.Button (Rect (690,443,24,24), "",muButton )) {	
			shI();
		}		
		GUI.Label (Rect (765,425,300,20), RPG_player.money.ToString(),tmpStyle);
	}				
	} else  invCam.rect = Rect (0, 0, 0, 0); 

//Bottom panel
GUI.skin = barSkin;
bottRect  = GUI.Window (1, bottRect , DoBottWindow2, "");	

// Character window
if(showChr)  { 
	GUI.skin = invSkin;
	chrRect = GUI.Window (3, chrRect, DoChrWindow, Lng.geet(4) );	
	//GUI.BringWindowToFront(3);
	}	


///
//GUI.BringWindowToFront(1);
}

// Make the contents of the window
function DoChrWindow (windowID : int) {

GUI.Label (Rect (30, 45, 100, 25),  Lng.geet(5)+" "+RPG_player.level);
GUI.Label (Rect (30, 65, 100, 25),  Lng.geet(8)+" "+RPG_player.exp);
GUI.Label (Rect (30, 85, 100, 25),  Lng.geet(6)+" "+Mathf.Round(RPG_player.health));
GUI.Label (Rect (30, 105, 100, 25),  Lng.geet(7)+" "+Mathf.Round(RPG_player.mana));
GUI.Label (Rect (30, 125, 100, 25),  Lng.geet(9)+" "+Mathf.Round(RPG_player.strength)+" + "+Mathf.Round(RPG_player.addStr));
GUI.Label (Rect (30, 145, 100, 25),  Lng.geet(10)+" "+Mathf.Round(RPG_player.defense)+" + "+Mathf.Round(RPG_player.addDef));
GUI.Label (Rect (30, 165, 100, 25),  Lng.geet(11)+" "+Mathf.Round(RPG_player.kickRate)+" + "+Mathf.Round(RPG_player.addKr));



GUI.Label (Rect (50, 440, 100, 20), "FPS "+fps_val);
//
	if(GUI.Button (Rect (20,440,24,24), "",muButton )) {	
		chI();
	}
}


function DoBottWindow2 (windowID : int) {
GUI.DrawTexture (Rect (146, 68, healthTx.width*1.5, healthTx.height*1.5),healthTx );
GUI.DrawTexture (Rect (735, 68, manaTx.width*1.5, manaTx.height*1.5),manaTx );
GUI.Label (Rect (195, 120, 100, 25), RPG_player.health.ToString());
GUI.Label (Rect (785, 120, 100, 25), RPG_player.mana.ToString());
GUI.Label (Rect (633, 68, 100, 25), RPG_player.level.ToString());
}

static function sset_dip(val,img) {
	for (y=0; y < img.height; ++y) {
	for (x=0; x < img.width; ++x) {
	var color = img.GetPixel (x, y);
	color.a = 1;
	img.SetPixel (x, y, color);
	}
	}

	var to =   img.height - img.height*val/100; //print(to);
	for (y= img.height ; y >  to; --y) {
	for (x=0; x < img.width; ++x) {
	color = img.GetPixel (x, y);
	color.a = 0;
	img.SetPixel (x, y, color);
	}
	}
	// Apply all SetPixel calls
	img.Apply();
}


function OnResize() {
	//invCam.rect = Rect (0, 0, 0, 0); 	
	//Camera.main.rect = Rect (0, 0.1, 1, 1); 
	//print(new_height);
	//print(Screen.width+";"+Screen.height+";"+hresize+";"+vresize);
}