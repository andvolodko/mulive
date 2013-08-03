var Forest_snd :AudioClip;
var Spider_snd :AudioClip;
static var onePlayGlobal =0;
private var timea: float=10;

function Update () {
timea += Time.deltaTime * 1;
// Assign the other clip and play it
	if(timea > 10) {
	timea=0;
	audio.clip = Forest_snd;
	audio.Play();	
	//yield WaitForSeconds (audio.clip.length);
	}
	//if(onePlayGlobal==1) { audio.PlayOneShot(Spider_snd); onePlayGlobal=0; }
}

function play() {
	//audio.PlayOneShot(Spider_snd);
}