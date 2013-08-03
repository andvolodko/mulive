var Obj:GameObject;
var clothItem:GameObject;
var clothType : String;
var dropItem : AudioClip;
var addItem : AudioClip;
var itemSkin :  GUISkin;
var defense : float;
var strength : float;
var bodyHide : boolean=true;
var animName:String = ""; 
//
var lngPos:int=0;
//
var sizeGlobal:Vector2 = Vector2(1,1); 
var marginInv:Vector3 = Vector3(0,3,-3);
var marginInvCloth:Vector3 = Vector3(0,0,-1);
//
@HideInInspector 
public var inInv:boolean = false;
@HideInInspector 
public var posInInv:int = 0;
@HideInInspector 
public var newPosInInv:int = 0;
@HideInInspector 
public var inClothes:boolean = false;
@HideInInspector 
public var newPosInClothes:int = 0;
@HideInInspector 
public var posInClothes:int = 0;
@HideInInspector 
public var shaded:boolean = false;
@HideInInspector 
public var deleted:boolean = false;
@HideInInspector 
public var delItems : Array ;

private var rotate:boolean = false;
private var dropped:boolean = false;
private var hovered:boolean = false;
private var dropTime:float = 0.0;
private var cons:int=1;
private var tmpPos:Vector3;
private var tmpTexture:Texture2D;
private var tmpTexture2:Texture2D;
private var showShort:boolean = true;
private var tmpMaterials : Array ;
private var tmpMaterials2 : Array ;

///////// Functions

function Start(){	
// Item
	tmpTexture = new Texture2D (640, 480, TextureFormat.ARGB32, false);
	for (y=0; y < tmpTexture.height; ++y) {
	for (x=0; x < tmpTexture.width; ++x) {
		var col = Color(0.07,0.12,0.18,0.8);
		if(y>(tmpTexture.height-20)) col = Color(0.07,0.12,0.18,1);
		tmpTexture.SetPixel (x, y, col );
	}
	}
	tmpTexture.Apply();
	itemSkin.window.normal.background = tmpTexture;
	itemSkin.window.hover.background = tmpTexture;
	itemSkin.window.active.background = tmpTexture;
	itemSkin.window.focused.background = tmpTexture;
	
// Texture 2
	tmpTexture2 = new Texture2D (150, 20, TextureFormat.ARGB32, false);
	for (y=0; y < tmpTexture2.height; ++y) {
	for (x=0; x < tmpTexture2.width; ++x) {
		col = Color(0.07,0.12,0.18,0.8);
		tmpTexture2.SetPixel (x, y, col );
	}
	}
	tmpTexture2.Apply();

	// Save materials
	tmpMaterials = new Array();
	tmpMaterials2 = new Array();
	for (var  mat : Material in Obj.renderer.materials)
	{
		tmpMaterials.Add(mat.shader.name);
		if( mat.HasProperty("_Color") ) tmpMaterials2.Add(mat.color.a); else tmpMaterials2.Add(0); 
	}		
	// For del items
	delItems = new Array();
	
}
 
function Update() {
var i:int=0; 
	if(inInv) {
		 if(shaded) {
			for (var  mat : Material in Obj.renderer.materials)
			{
				mat.shader = Shader.Find( tmpMaterials[i] );
				i++;
			}
			shaded=false;
		}
		//if(!hovered) Inventory3D.bgSet(sizeGlobal.x,sizeGlobal.y,posInInv,"gray");
		if(rotate) transform.Rotate (0,(400+Random.Range(0, 200) ) * Time.deltaTime, 0); 
		else transform.localEulerAngles=Vector3(0,90,-90);
		// For anim
		if(inClothes && RPG_player.animKickName =="") {
			RPG_player.animKickName = animName;
		} 
	} else {
	
		if(dropped ) {
			transform.position.y+=10*Time.deltaTime*cons;
			transform.Rotate(300*Time.deltaTime,0,0);
			if(Time.time>dropTime)  { 
			dropTime=Time.time+0.2;
			if(tmpPos.y>=transform.position.y) {
			transform.position.y = tmpPos.y;  
			transform.Rotate (Random.Range(0, 360),0,0); 
			dropped = false; cons=1; dropTime=0;rotate=false;} else	cons=-1;
			}
		}
		
		//TODO auto deleted
		//if(time) deleted=true;
	
	}
}

function drop() {
	tmpPos = transform.position;
	dropTime=Time.time+0.2;
	//print("drop");
	dropped=true;
	audio.PlayOneShot(dropItem);
}

function add() {
	audio.PlayOneShot(addItem); 
	//print("add");
}

function del() {
	if(inInv) Inventory3D.busySet(sizeGlobal.x,sizeGlobal.y,posInInv,false); 
	posInInv=0;
	Obj.renderer.enabled = false;
	deleted=true;	
}

// Fades the red component of the material to zero
// while the mouse is over the mesh
function OnMouseOver () {
hovered=true;
	if(inInv) {
		if(Input.GetMouseButtonUp(0) && Inventory3D.currentItem==null) {
		if(Inventory3D.canTake) { 
			if(!inClothes) Inventory3D.busySet(sizeGlobal.x,sizeGlobal.y,posInInv,false);
			 else Inventory3D.busySetCloth(posInClothes,false);
			Inventory3D.currentItem = gameObject;
			Inventory3D.checkBodyParts = true;
			inClothes=false;
			RPG_player.animKickName = "";
			}
		}		
		if(!rotate && Inventory3D.currentItem==null) rotate=true;		
		// TODO Hero character
		if(!inClothes)  { Inventory3D.bgSet(sizeGlobal.x,sizeGlobal.y,posInInv,"green"); }
		else Inventory3D.bgSetCloth(posInClothes,"green");
	} else {
		if(!shaded) shaded=true;
		Cursor.getGlobal=true;
		i=0;
		for (var  mat : Material in Obj.renderer.materials)
		{
			if(tmpMaterials2[i]>0)	
			mat.shader = Shader.Find( "Toon/Basic Outline" );
			i++;
		}		
			if(Input.GetMouseButtonDown (0)) {
				RPG_player.item=gameObject;
			}
	}	
}
// Fades the red component of the material to zero
// while the mouse is over the mesh
function OnMouseExit () {
hovered=false;
	if(inInv) {
		rotate=false;
		if(!inClothes)  { Inventory3D.bgSet(sizeGlobal.x,sizeGlobal.y,posInInv,"gray"); }
		else Inventory3D.bgSetCloth(posInClothes,"gray");
//		print("gray");
	} else {
	shaded=false;
		Cursor.getGlobal=false;
	var i:int=0; 
	for (var  mat : Material in Obj.renderer.materials)
	{
		mat.shader = Shader.Find( tmpMaterials[i] );
		i++;
	}
	}	
}



//GUI
function OnGUI () {

// Item
if(hovered) { 
	GUI.skin = itemSkin;
	var mouse_pos:Vector3=Input.mousePosition;
	var winName:String = Lng.geet(lngPos)+" - 1" ;
	var mx = mouse_pos.x+32;
	var my = -(mouse_pos.y-Screen.height)+32;	
		if(inInv) {
		if(mx+200 > Screen.width) mx = mx-264;
		if(my+200 > Screen.height) my = Screen.height-200;
		tmpwin = Rect(mx,my,200,200); 
		tmpwin = GUI.Window (10, tmpwin , DoItemWindow, winName );	
		GUI.BringWindowToFront(10);		
		} else {
				// Label if on grass
			var tmpStyle = new GUIStyle();
			tmpStyle.normal.textColor = Color(1,1,1);
			tmpStyle.normal.background = tmpTexture2;
			tmpStyle.alignment = TextAnchor.UpperCenter;
			mx = mouse_pos.x+32;
			my = -(mouse_pos.y-Screen.height)+32;	
			if(mouse_pos.x+20+32 > Screen.height) mx = Screen.height;
			if(mouse_pos.y+150+32 > Screen.width) my = Screen.width;
			GUI.Label (Rect(mx, my, 150, 20), winName,tmpStyle ); 
		}	
}

}

// Make the contents of the window
function DoItemWindow (windowID : int) {
	if(inInv) {
	if(strength>0) GUI.Label (Rect (5, 20, 100, 20), Lng.geet(9)+" "+strength.ToString());
	if(defense>0) GUI.Label (Rect (5, 40, 100, 20), Lng.geet(10)+" "+defense.ToString());
	var tmpStyle = new GUIStyle();
	tmpStyle.normal.textColor = Color(0.35,0.75,0.94);	
	//GUI.Label (Rect (5, 60, 200, 20), "Предназначено для Воина",tmpStyle);
	}
}
