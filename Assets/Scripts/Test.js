// Instantiates 10 copies of prefab each 2 units apart from each other
var prefab : GameObject; 
var j = 1;
var jj = 0;
for (var i=0;i<10;i++) {
if(i%10) { j++; jj=0;}
jj++;
//var rrnd = Instantiate (prefab, Vector3(jj * 1 +237, 5, 211 + j*1), Quaternion.identity);
//rrnd.active = false;
}
function Update () {
}