
///////////////
var speed = 6.0;
var jumpSpeed = 8.0;
var gravity = 20.0;
private  var speedx = 0;
private  var speedz = 0;
private var moveDirection = Vector3.zero;
private var grounded : boolean = false;

var rayCastPlane : Transform;

function FixedUpdate() {
	if (grounded) {
		// We are grounded, so recalculate movedirection directly from axes
		moveDirection = new Vector3(Input.GetAxis("Horizontal"), 0, Input.GetAxis("Vertical"));
		moveDirection = transform.TransformDirection(moveDirection);
		moveDirection *= speed;
		/* if( Input.GetMouseButton(0) ){
		//moveDirection = Input.mousePosition;
		moveDirection = Camera.main.ScreenPointToRay (Input.mousePosition).GetPoint (1000);
		moveDirection *= 0.1;
		moveDirection.y = 0;
		}	*/	
		
		if (Input.GetButton ("Jump")) {
			moveDirection.y = jumpSpeed;
		}
	}

	// Apply gravity
	moveDirection.y -= gravity * Time.deltaTime;
	
	// Move the controller
	var controller : CharacterController = GetComponent(CharacterController);
	var flags = controller.Move(moveDirection * Time.deltaTime);
	grounded = (flags & CollisionFlags.CollidedBelow) != 0;

	if(speedx>0) { transform.position.x +=0.1;  speedx -=0.1; }
	if(speedx<0) { transform.position.x -=0.1;  speedx +=0.1; }
	if(speedz>0) { transform.position.z +=0.1;  speedz -=0.1; }
	if(speedz<0) { transform.position.z -=0.1;  speedz +=0.1; }

	if (!Input.GetMouseButton (0))
		return;
			
	var ray = Camera.main.ScreenPointToRay (Input.mousePosition);
	var hit : RaycastHit;

		if (Physics.Raycast (ray, hit, 200)) {
			Debug.DrawLine (ray.origin, hit.point);
				speedx = hit.point.x - transform.position.x ;
				speedz = hit.point.z - transform.position.z;					
		}	

}

@script RequireComponent(CharacterController)