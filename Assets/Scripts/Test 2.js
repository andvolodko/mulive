function OnTriggerEnter(collision : Collider) {
	print(collision.name); 
}
function OnCollisionEnter(collision : Collision) {
	print(collision.gameObject.name); 
}