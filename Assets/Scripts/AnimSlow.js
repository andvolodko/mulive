
function Start () {
	//Animation
	// Make all animations in this character play at half speed
	for (var state : AnimationState in animation) {
	state.speed = 0.2;
	}
}