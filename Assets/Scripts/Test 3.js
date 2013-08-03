var boots : GameObject;
var armor : GameObject;
var or : GameObject;

function Start() {

wear(boots,or);
wear(armor,or);

}

function wear(what,onObj) {
	what = Instantiate (what, onObj.transform.position, onObj.transform.rotation);
	what.transform.localScale = Vector3(1,1,1);
	what.transform.parent = gameObject.transform;
	var tmpSkin = what.GetComponentInChildren(SkinnedMeshRenderer);
	var tmpArr = onObj.GetComponentsInChildren(SkinnedMeshRenderer);
	for(var bon in tmpSkin.bones) {	
		for(skn in tmpArr) {
			for(var bons in skn.bones) {
				if(bons.name==bon.name) { 
				reset2(bon,bons);	
				}
			}
		}	
	}

}


private function reset(obj) {
	obj.localPosition = Vector3.zero;
	obj.localRotation = Quaternion.identity;
	for (var  child : Transform in obj) {		
		reset(child); 
	}
}


private function reset2(obj,obj2) {
	obj.parent = obj2;
	obj.position = obj2.position;		
	reset(obj);	
	for (var  child2 : Transform in obj2) {		
		for (var  child : Transform in obj) {		
			if(child.name==child2.name) reset2(child,child2); 
		}		
	}
}


function Update() {
	or.transform.Rotate(0,0,150*Time.deltaTime);
}