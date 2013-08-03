var busyTxt:Texture2D;
var freeTxt:Texture2D;
var free:boolean=true;

function Start() {
//renderer.material.mainTexture = busyTxt;
//renderer.material.color = Color(0.5,0,0);
}

function Update () {
}

function busy(typ:boolean) {
	if(typ) { 
		renderer.material.mainTexture = busyTxt;	
		free=false;
		}
	else {
		free=true;
		renderer.material.mainTexture = freeTxt;
	}
}

function bg(typ:String) {
	switch(typ) {
	case "red": renderer.material.color = Color(0.5,0,0);
	break;
	case "green": renderer.material.color = Color(0,0.5,0);
	break;
	case "gray": renderer.material.color = Color(0.3,0.3,0.3,1);
	break;	
	
	}
}