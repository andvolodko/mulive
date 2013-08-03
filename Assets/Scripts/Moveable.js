var speed = 3.0;
var rotationSpeed = 5.0;
var gravity = 10.0;
var maxVelocityChange = 3.0;
var canJump = true;
var jumpHeight = 2.0;
var dontComeCloserRange = 5.0;
var maxstop = 3;
var target : Transform;
var command : String = "Stay";
var cst = false;
var points : Vector3[];
var curpoint = 0;

private var grounded = false;
private var targetVelocity:Vector3;
private var pickNextWaypointDistance = 0.0;
private var lastShot = -10.0;
//private var controller;
private var waypointPosition : Vector3;
private var move_margin = 3.5;

// Make sure there is always a character controller
//@script RequireComponent ("RigidWalker")

function Start () {
	waypointPosition = transform.position;
	command = "Stay";
	//controller = GetComponent ("RigidWalker");

	Patrol();
	yield WaitForSeconds (Random.value*0.5);
	while (true) {
		FindPoint (curpoint);
		yield WaitForSeconds (0.2);
	}

	
}


function Update () {
	//Debug.color = Color.blue;
	Debug.DrawLine (transform.position, waypointPosition, Color.blue);
}

function SetPoints (newPoints : Vector3[]) {
	points = newPoints;
	FindPoint (0);
	command = "Walk";
}

function FindPoint (cpoint : int) {
	curpoint = cpoint;
	if (!points || points.length == 0 || curpoint >= points.length) {	
		waypointPosition = transform.position;
		Stop ();
		return;
	}
	if (points.length == 1) {
		waypointPosition = points[0];
		command = "Walk";
		return;
	}
	command = "Walk";
	waypointPosition = points[curpoint];
	p = waypointPosition;
	p.y = transform.position.y;
	if (Vector3.Distance (transform.position,p) < dontComeCloserRange) {
		curpoint++;
	}
}

function Patrol () {
	//var curWayPoint = AutoWayPoint.FindClosest(transform.position);
	while (true) {
		if (command == "Walk") {
			setTargetCourse(waypointPosition);
		}
		yield;
	}
}

function Stop () {
	command = "Stay";
	targetVelocity.x = 0;
	targetVelocity.z = 0;
	SendMessage("SetSpeed", 0.0, SendMessageOptions.DontRequireReceiver);
//	print(name+" is stopping");
}

function RotateTowards (position : Vector3) {
	SendMessage("SetSpeed", 0.0);
	
	var direction = position - transform.position;
	direction.y = 0;
	if (direction.magnitude < 0.1)
		return;
	
	// Rotate towards the target
	transform.rotation = Quaternion.Slerp (transform.rotation, Quaternion.LookRotation(direction), rotationSpeed * Time.deltaTime);
	transform.eulerAngles = Vector3(0, transform.eulerAngles.y, 0);
}

function MoveToPoint(destinationPoint : Vector3){
	command = "Walk";
	//setTargetCourse(destinationPoint);
	print("movetopoint"+name);
	GetComponent("Seeker").StartPath (transform.position,destinationPoint);
}

function setTargetCourse (position : Vector3) {
//print(position);
	var direction = position - transform.position;
	direction.y = 0;
	
	if (direction.magnitude < 1) {
		Stop ();
		return;
	}	
	// Rotate towards the target
	
	transform.rotation = Quaternion.Slerp (transform.rotation, Quaternion.LookRotation(direction), rotationSpeed * Time.deltaTime);
	transform.eulerAngles = Vector3(0, transform.eulerAngles.y, 0);

	// Modify speed so we slow down when we are not facing the target
	var forward = transform.TransformDirection(Vector3.forward);
	var speedModifier = Vector3.Dot(forward, direction.normalized);
	speedModifier = Mathf.Clamp01(speedModifier);

	// Move the character
	targetVelocity = forward * speed * speedModifier;
	//RotateTowards(position);
	
	//SendMessage("SetSpeed", speed * speedModifier, SendMessageOptions.DontRequireReceiver);
}


//---------------------

function Awake (){
    rigidbody.freezeRotation = true;
    rigidbody.useGravity = false;
}

function FixedUpdate (){
    if (grounded && targetVelocity!=null)
    {
        // Calculate how fast we should be moving
        //var targetVelocity = new Vector3(Input.GetAxis("Horizontal"), 0, Input.GetAxis("Vertical"));
		//print(targetVelocity);
//        tv = transform.TransformDirection(targetVelocity);
        //targetVelocity *= speed;
        
        // Apply a force that attempts to reach our target velocity
        var velocity = rigidbody.velocity;
		
        var velocityChange = (targetVelocity - velocity);
        velocityChange.x = Mathf.Clamp(velocityChange.x, -maxVelocityChange, maxVelocityChange);
        velocityChange.z = Mathf.Clamp(velocityChange.z, -maxVelocityChange, maxVelocityChange);
        velocityChange.y = 0;
        rigidbody.AddForce(velocityChange, ForceMode.VelocityChange);
//		print(velocityChange);
    
        // Jump
        if (canJump && Input.GetButton("Jump"))
        {
          //  rigidbody.velocity = Vector3(velocity.x, CalculateJumpVerticalSpeed(), velocity.z);
        }
    }
    
    // We apply gravity manually for more tuning control
    rigidbody.AddForce(Vector3 (0, -gravity * rigidbody.mass, 0));
    
    grounded = false;
}

function OnCollisionStay (){
    grounded = true;    
}

function CalculateJumpVerticalSpeed (){
    // From the jump height and gravity we deduce the upwards speed 
    // for the character to reach at the apex.
    return Mathf.Sqrt(2 * jumpHeight * gravity);
}