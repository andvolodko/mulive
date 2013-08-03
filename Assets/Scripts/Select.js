private var  load_time:float = 5.0;
private var stay_time:float=0;

function Update () {
	stay_time += Time.deltaTime;
	if(stay_time>load_time) Application.LoadLevel ("Lorencia");
}
