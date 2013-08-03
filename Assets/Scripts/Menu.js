var muButton : GUIStyle;
var mySkin : GUISkin;
var logo_time:float = 2.0;
private var logo_stay:float=0;
var menuTexture : Texture;
var Logo_audio : AudioClip;
var Login_audio : AudioClip;
private var Logo:GameObject;
private var loginPos:Vector2;
private var Server_ok:boolean = false;
private var login_win : Rect = Rect (20, 20, 250, 216);
private var login_show:boolean = false;



function Start() {	
	loginPos = Vector2(Screen.width/2-menuTexture.width/2,Screen.height);
	Logo  = GameObject.FindWithTag("Logo");
	Logo.renderer.enabled = false;
	Server_ok = true; // TODO newtwork ))
	if(Server_ok) login_show=true; 
	audio.PlayOneShot(Login_audio);
}

function Update () {
	logo_stay += Time.deltaTime;
	if(logo_stay>logo_time && !Logo.renderer.enabled) { 
		Logo.renderer.enabled = true;
		audio.PlayOneShot(Logo_audio);
	}	
	login_wins();
}

function login_wins() {
	if(login_show && loginPos.y>Screen.height-menuTexture.height+10 ) loginPos.y-=400*Time.deltaTime;
	if(!login_show ) {
		loginPos.y+=400*Time.deltaTime;
		if(loginPos.y>Screen.height) Application.LoadLevel ("Loading_Lorencia"); //Application.LoadLevel ("Select");
	}	
	login_win = Rect (loginPos.x, loginPos.y, 250, 216);
}

function OnGUI () {
	GUI.skin = mySkin;
	GUI.Window (0, login_win, loginWinFunc, "");
	GUI.BringWindowToBack(0);
}

function loginWinFunc (windowID : int) {

	if(GUI.Button (Rect (25,50,200,20), Lng.geet(0) )) {
		login_show = !login_show;
		audio.PlayOneShot(Login_audio);	
	}
	if(GUI.Button (Rect (25,90,200,20), Lng.geet(16) )) {
		Application.LoadLevel ("Loading_All_items");
	}	
	/* if(GUI.Button (Rect (77,90,100,20), Lng.geet(1) )) {
	}
	if(GUI.Button (Rect (77,130,100,20), Lng.geet(2) )) {
	}	*/

}
