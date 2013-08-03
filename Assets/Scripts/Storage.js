var Obj:GameObject;
///////// Functions
function Start() {
	//Destroy(gameObject,5);
}


// Fades the red component of the material to zero
// while the mouse is over the mesh
function OnMouseOver () {
//renderer.material.color.r -= 0.1 * Time.deltaTime;
	Cursor.getGlobal=true;
		for (var  mat : Material in Obj.renderer.materials)
		{
			mat.shader = Shader.Find( "Toon/Basic Outline" );
		}
}
// Fades the red component of the material to zero
// while the mouse is over the mesh
function OnMouseExit () {
	Cursor.getGlobal=false;
		for (var  mat : Material in Obj.renderer.materials)
		{
			mat.shader = Shader.Find( "Diffuse" );
		}
}