var free:boolean=true;

function Start() {
//renderer.material.mainTexture = busyTxt;
//renderer.material.color = Color(0.5,0,0);
}

function Update () {
}

function busy(typ:boolean) {
	if(typ) { 
		free=false;
		}
	else {
		free=true;
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