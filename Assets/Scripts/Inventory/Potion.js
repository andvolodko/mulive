var potSound : AudioClip;
var healthNum : int;
private var playr:GameObject;
///
private var imt:GameObject;
private var script : Item;

function Start () {
//imt
playr = GameObject.Find("Player");
script = GetComponentInChildren(Item);
//script.DoSomething ();
}

function Update () {
}

function OnMouseOver () {

	if(script.inInv) {
		if(Input.GetMouseButtonUp(1) && Inventory3D.currentItem==null) {
			audio.PlayOneShot(potSound);
			playr.GetComponent("RPG_player").doctor(healthNum);
			script.del();
			//
		}
		}
}