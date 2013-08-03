var  load_time:float = 2.0;
var Skin : GUISkin;
var Level : String;
private var stay_time:float=0;

function Update () {
	stay_time += Time.deltaTime;
	if(stay_time>load_time) Application.LoadLevel (Level);
}

function OnGUI () {
	GUI.skin = Skin;	
	GUI.Label (Rect (Screen.width/2-20,Screen.height/2+120,100,50), Lng.geet(12));
}
 