var Cell:GameObject;
var invTx1 : Texture2D;
var invTx2 : Texture2D;
var cam : Camera;
var Hero:GameObject;
var clothes : GameObject[];
var lHand:GameObject;
var rHand:GameObject;
// To hide body parts
var objBody:GameObject;
var objGloves:GameObject;
var objPants:GameObject;
var objBoots:GameObject;
var objCap:GameObject;

//
private var tmp:GameObject;
static var cells:Array;
static var clothes_stat:Array;
static var items:Array;
static var pos;
static var ia:int;
static var currentItem:GameObject = null;
static var canTake:boolean = true;
private var takeTime:float = 0.0;
private var tmpTime:float = 0.0;
static var addPos:int=0;
static var marginInv:Vector3 = Vector3(0,3,-3);
static var marginInvCloth:Vector3 = Vector3(0,0,-1);
static var checkBodyParts:boolean = true;


function Start() {
clothes_stat = clothes;
pos = transform; 
cells = new Array();
items = new Array();
for(i=1;i<9;++i) {
	for(j=1;j<9;++j) {		
		ia = j+(i-1)*10-(2*i-1)+1;
		cells[ia] = Instantiate(Cell, Vector3(transform.position.x+i*2.2-10.2,transform.position.y-7,transform.position.z-j*2.2-3), transform.rotation );
		cells[ia].transform.parent = pos;
		cells[ia].transform.localScale.x=0.23;
		cells[ia].transform.localScale.z=0.23;
		//print(cells.length);
	}
}
clearAll();
}



function Update () {

// Manage in inventory
if(currentItem !=null) {
	//Clear
	clearAll();	
	//
canTake=false;
var tmpCur = currentItem.GetComponent("Item");
clearArr(tmpCur.delItems);
tmpCur.newPosInInv = 0;
tmpCur.newPosInClothes = 0 ;
var plane = new Plane(Vector3.up, currentItem.transform.position);
var ray = cam.ScreenPointToRay (Input.mousePosition);
var hitdist = 0.0; var hits : RaycastHit[];
    if (plane.Raycast (ray, hitdist)) {
        // Get the point along the ray that hits the calculated distance.
        var targetPoint = ray.GetPoint(hitdist);
        currentItem.transform.position = targetPoint;	
		ray.origin -=  tmpCur.marginInv; 
		hits = Physics.RaycastAll (ray.origin, ray.direction, 20.0);		
		//print(ray.origin);
		for (i=1;i<cells.length;++i)
		{   br=false;
			for (var  ih=0;ih<hits.length;ih++)
				{
					var hit : RaycastHit = hits[ih];
					if(Vector3.Distance(hit.point,cells[i].transform.position)<1.5)  { 
					tmpCur.newPosInInv=i;
					br = true; break; 
					}
				}
				if(br) break;
		}
		// Same margin
		ray.origin +=  tmpCur.marginInv; 
		hits = Physics.RaycastAll (ray.origin, ray.direction, 20.0);	
		for (i=1;i<clothes.length;++i)
		{   br=false;
			for (ih=0;ih<hits.length;ih++)
				{
					hit = hits[ih];
					if(Vector3.Distance(hit.point,clothes[i].transform.position)<2.0)  { 
					tmpCur.newPosInClothes=i;
					br = true; break; 
					}
				}
				if(br) break;
		}		
    }
		if(canAddInPos(tmpCur.sizeGlobal,tmpCur.newPosInInv) && !RPG_player.mouse_in() ) bgSet(tmpCur.sizeGlobal.x,tmpCur.sizeGlobal.y,tmpCur.newPosInInv,"green");
		if(!canAddInPos(tmpCur.sizeGlobal,tmpCur.newPosInInv) && tmpCur.newPosInInv>0 ) bgSet(tmpCur.sizeGlobal.x,tmpCur.sizeGlobal.y,tmpCur.newPosInInv,"red");		
		checkInCloth(tmpCur.newPosInClothes,true);
}


// Drop in Inventory
if(Input.GetMouseButtonDown (0) && currentItem!=null ) {

	if(RPG_player.mouse_in())	{
		currentItem.transform.parent = null;	
		currentItem.transform.localScale = Vector3(0.7,0.7,0.7);
		currentItem.transform.eulerAngles=Vector3(0,0,-90);
		currentItem.transform.position = Hero.transform.position; 
		tmpCur.inInv = false;	
		tmpCur.inClothes = false;
		tmpCur.drop();		
		currentItem=null;
	}  // Add in clothes
	else if(checkInCloth(tmpCur.newPosInClothes,false)) {
			clothes[tmpCur.newPosInClothes].GetComponent("Cloth").free = false;
			tmpCur.add(); 
			//tmpCur.posInInv = 0;
			tmpCur.posInClothes = tmpCur.newPosInClothes;
			tmpCur.inClothes = true;
			currentItem.transform.position = clothes[tmpCur.newPosInClothes].transform.position; 
			currentItem.transform.position +=tmpCur.marginInvCloth; 		
			wear(tmpCur.clothItem,tmpCur.clothType,Hero,tmpCur.delItems);
			if(tmpCur.bodyHide) hideShowBodyParts(tmpCur.clothType,true);
			currentItem=null;
			takeTime = Time.time+0.5;		
		} //ADD in Inv
	else if(canAddInPos(tmpCur.sizeGlobal,tmpCur.newPosInInv)) {
		busySet(tmpCur.sizeGlobal.x,tmpCur.sizeGlobal.y,tmpCur.newPosInInv,true);
		tmpCur.add(); 
		tmpCur.posInInv = tmpCur.newPosInInv;
		currentItem.transform.position = cells[tmpCur.newPosInInv].transform.position; 
		currentItem.transform.position +=tmpCur.marginInv; 				
		tmpCur.inClothes = false;
		currentItem=null;
		takeTime = Time.time+0.5;		
	}
	clearAll();
}

if(takeTime<Time.time && !canTake) canTake=true;

if(Time.time>tmpTime) {
	tmpTime=Time.time+0.5;
	// Update items position
	i=0; addStr=0; addDef=0;
	for (var  itm : GameObject in items)
	{
		//if(currentItem!=itm) itm.transform.position = transform.position;
		itmc = itm.GetComponent("Item");
		if( itmc.deleted ) { Destroy(itm,1); items.RemoveAt(i); clearAll();}
		else { 
			if(itmc.inClothes) { addStr +=itmc.strength; addDef +=itmc.defense; }
			i++;
		}
	}
	RPG_player.addStr = addStr;
	RPG_player.addDef = addDef;

	// Update body parts
	if(checkBodyParts) {
		for (var  itm : GameObject in clothes)
		{
			if(itm.GetComponent("Cloth").free) hideShowBodyParts(itm.name,false);
		}
		checkBodyParts=false;
	}
}
}

// Add from ground etc
static function addItem(item){
	if(canAdd(item.GetComponent("Item").sizeGlobal) ) {
	item.transform.parent = pos;	
	item.transform.localScale = Vector3(4,4,4);
	item.transform.position = cells[addPos].transform.position; 
	item.transform.position +=item.GetComponent("Item").marginInv; 
	item.transform.eulerAngles=Vector3(0,90,90);
	item.GetComponent("Item").inInv = true;
	item.GetComponent("Item").posInInv = addPos;
	item.GetComponent("Item").add(); 
	Cursor.getGlobal=false;
	items.Push(item);
	} else item.GetComponent("Item").drop();
}

static function canAdd(sz) {
	var can:boolean = true;
	for(i=1;i<9;++i) {
		for(j=1;j<9;++j) {
			ia = j+(i-1)*10-(2*i-1)+1;
			if(ia<cells.length) {
			if(cells[ia].GetComponent("Cell").free && (j+sz.y)<10 && (i+sz.x)<10) {
					can=true; addPos = ia;					
					for(ii=0;ii<sz.x;++ii) {
					for(jj=0;jj<sz.y;++jj) {
						//ia = j+jj+(i+ii-1)*9-(2*i+ii-1)+1;
						ia= gia(i+ii,j+jj);
						if(!cells[ia].GetComponent("Cell").free )  can=false; 
						//print(ii+";"+jj);
						//print(ia);
					}
					}
					if(can) { 
						busySet	(sz.x,sz.y,addPos,true);
					return true;
					}
				}	
			} 
		}
	}
	return false;
}

static function canAddInPos(sz,pos) {
	if(pos>0) {
		var can:boolean = true;
				ia = pos; i=Mathf.Ceil (pos/8.0); j=Mathf.Round(pos-i*8.0) + 8;
				if(cells[ia].GetComponent("Cell").free && (j+sz.y)<10 && (i+sz.x)<10) {
						can=true; 
						for(ii=0;ii<sz.x;++ii) {
						for(jj=0;jj<sz.y;++jj) {
							//ia = j+jj+(i+ii-1)*10-(2*i+ii-1)+1; 
							ia= gia(i+ii,j+jj);
							if(ia!=0) { if(!cells[ia].GetComponent("Cell").free )  can=false; }
							//print(ii+";"+jj);
						}
						}
						if(can)  return true;
				} 
				return false;	
			}
	//return false;	
}
function checkInCloth(pos,ligt) {
if(pos>0) {
	var ttmp = clothes[pos].GetComponent("Cloth");
		if(ttmp.free && clothes[pos].name==currentItem.GetComponent("Item").clothType) { 
			if(ligt) ttmp.bg("green"); 
			return true; }
		else { 
			ttmp.bg("red"); 
			if(ligt) ttmp.bg("red"); 
			return false; }
}
}
static function busySet(sx:int,sy:int,pos:int,typ:boolean) {
					i=Mathf.Ceil (pos/8.0); j=Mathf.Round(pos-i*8.0) + 8;
					//print(i+";"+j+";"+pos);
						for(ii=0;ii<sx;++ii) {
						for(jj=0;jj<sy;++jj) {
							//ia = j+jj-ii+(i+ii-1)*10-(2*i+ii-1)+1;
							ia= gia(i+ii,j+jj);
							if(ia!=0) cells[ia].GetComponent("Cell").busy(typ);
						}
						}					
}
static function busySetCloth(pos:int,typ:boolean) {
					clothes_stat[pos].GetComponent("Cloth").busy(typ);					
}
static function bgSet(sx:int,sy:int,pos:int,typ:String) {
					i=Mathf.Ceil (pos/8.0); j=Mathf.Round(pos-i*8.0) + 8;
					//print(i+";"+j+";"+pos);
						for(ii=0;ii<sx;++ii) {
						for(jj=0;jj<sy;++jj) {
							//ia = j+jj-ii+(i+ii-1)*10-(2*i+ii-1)+1;
							ia= gia(i+ii,j+jj);
							if(ia!=0) cells[ia].GetComponent("Cell").bg(typ);
						}
						}					
}
static function bgSetCloth(pos:int,typ:String) {
			clothes_stat[pos].GetComponent("Cloth").bg(typ);
}
function clearAll() {
	for (i=1;i<cells.length;++i)
	{ 
		cells[i].GetComponent("Cell").bg("gray");
	} 
	for (i=1;i<clothes.length;++i)
	{ 
		clothes[i].GetComponent("Cloth").bg("gray");
	} 	
}

function OnGUI() {
}

//FOR wear cloth

function wear(what,cTyp,onObj,delArr) {


if( cTyp=="Body" || cTyp=="Gloves" || cTyp=="Pants" || cTyp=="Boots" || cTyp=="Cap" )
{
//Clothes
	what = Instantiate (what, onObj.transform.position, onObj.transform.rotation);
	delArr.Add(what); 
	what.transform.localScale = Vector3(1,1,1);
	what.transform.parent = onObj.transform;
	var tmpSkin = what.GetComponentInChildren(SkinnedMeshRenderer);
	var tmpArr = onObj.GetComponentsInChildren(SkinnedMeshRenderer);
	for(var bon in tmpSkin.bones) {	
		for(skn in tmpArr) {
			for(var bons in skn.bones) {
				if(bons.name==bon.name) { 
				reset2(bon,bons,delArr);	
				}
			}
		}	
	}	
}
else if(cTyp=="LR") {
// Weapons
	what = Instantiate (what, onObj.transform.position, onObj.transform.rotation);
	delArr.Add(what);
	what.transform.localScale = Vector3(1,1,1);
	if(clothes[currentItem.GetComponent("Item").newPosInClothes].transform.localPosition.x>0) what.transform.parent = lHand.transform;
	else what.transform.parent = rHand.transform;
	what.transform.localPosition = Vector3.zero;
	what.transform.localRotation = Quaternion.identity;	
	//var tmpPs = what.transform.Find("smdimport");
	//what.transform.localPosition += what.transform.position-tmpPs.transform.position;
}
}

function hideShowBodyParts(pname,sh) {
	var shd = Shader.Find( "Transparent/Diffuse" );
	if(!sh) shd = Shader.Find( "Diffuse" );
	else shd = Shader.Find( "Transparent/Diffuse" );	
	if(  pname=="Cap" ) objCap.renderer.material.shader = shd;
	if(  pname=="Boots" ) objBoots.renderer.material.shader = shd;
	if(  pname=="Pants" ) objPants.renderer.material.shader = shd;
	if(  pname=="Gloves" ) objGloves.renderer.material.shader = shd;
	if(  pname=="Body" ) objBody.renderer.material.shader = shd;
}

private function reset(obj) {
	obj.localPosition = Vector3.zero;
	obj.localRotation = Quaternion.identity;
	for (var  child : Transform in obj) {		
		reset(child); 
	}
}

private function reset2(obj,obj2,delArr) {
	delArr.Add(obj);
	obj.parent = obj2;
	obj.position = obj2.position;		
	reset(obj);	
	for (var  child2 : Transform in obj2) {		
		for (var  child : Transform in obj) {		
			if(child.name==child2.name) reset2(child,child2,delArr); 
		}		
	}
}

private function clearArr(Arr) {
	while(Arr.length > 0)  // Thanks to    http://www.sapethemape.com/2008/06/unity3d-sqlite-visualization/
	//for (var  objct : Object in Arr )
	{	
		var child = Arr.Pop();	
			var meshRenderers = child.GetComponentsInChildren (SkinnedMeshRenderer);
				for (var meshR : SkinnedMeshRenderer in meshRenderers) {
					DestroyImmediate(meshR);
				}
		
		Destroy(child); 
	}	
}

// ETC

static function gia(i,j) {
var ret:int=0;
	if(i==1)  ret = i*j;
	if(i>1)  ret = (8*(i-1) ) + j;
	if(ret<65 &&  ret>0) return ret;
	else return 0;
}