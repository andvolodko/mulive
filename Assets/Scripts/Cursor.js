//Texture = "CursorPush";
var muStyle : GUIStyle;
var settSkin : GUISkin;
var iWindow : AudioClip;
var icon_normal : Texture2D;
var icon_push : Texture2D;
var icon_attack : Texture2D;
var icon_get : Texture2D;
static var attackGlobal : boolean = false;
static var getGlobal : boolean = false;
private var cursor_pos : Rect = Rect (20, 20, 250, 216);
private var showSettings : boolean=false;
private var keyRate:float = 0.2;
private var nextFire:float = 0.0; // Show invent rate

function Start  () {
	Resources.UnloadUnusedAssets();			
	Screen.showCursor=false;
}

function OnGUI() {
	var icon: Texture2D= icon_normal;
	if(Input.GetMouseButton (0)) icon=icon_push;

	if(attackGlobal) icon=icon_attack;
	if(getGlobal) icon=icon_get;

	var mouse_pos:Vector3=Input.mousePosition;
	var rect:Rect = Rect (mouse_pos.x+1, -(mouse_pos.y-Screen.height)+1,32, 32);
	//print("MouseCoordCurrent: " + Input.mousePosition.x + "/" + Input.mousePosition.y + "/" + Input.mousePosition.z); 
	rect = GUI.Window (1000, rect, DoMyWindow, icon, muStyle);	

	// Settings window
	GUI.skin = settSkin;	
	if(Input.GetKey (KeyCode.Escape )  && Time.time > nextFire ) { 
		showSettings = !showSettings;
		nextFire = Time.time + keyRate;
		audio.PlayOneShot(iWindow);
	}		
	if(showSettings) {
		var rect2:Rect = Rect (Screen.width/2-160,Screen.height/2-160,320, 320);
		rect2 = GUI.Window (999, rect2, DoMyWindow2,Lng.geet(1));
		GUI.BringWindowToFront(999);
	}
	
	// Set cursor to top
	GUI.BringWindowToFront(1000);
}


function DoMyWindow (windowID : int) {
}


function DoMyWindow2 (windowID : int) {
		if(GUI.Button (Rect (35,40,250,24), Lng.geet(14) )) {	
			Screen.fullScreen = !Screen.fullScreen;
			audio.PlayOneShot(iWindow);
			showSettings = false;
		}			
		if(GUI.Button (Rect (35,70,250,24), Lng.geet(15) )) {	
			audio.PlayOneShot(iWindow);
			showSettings = false;
			Application.LoadLevel ("Loading");
		}				
		if(GUI.Button (Rect (35,100,250,24), Lng.geet(13) )) {	
			Application.Quit(); print("quit");
			audio.PlayOneShot(iWindow);
			showSettings = false;
		}			
		
}


/*
@ContextMenu ("Do Something")
function DoSomething () {
Debug.Log ("Perform operation");
}*/