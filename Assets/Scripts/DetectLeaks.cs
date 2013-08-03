using UnityEngine;
using System.Collections;

public class DetectLeaks : MonoBehaviour {
private int All = 0;
private int Textures = 0;
private int AudioClips = 0;
private int Meshes = 0;
private int Materials = 0;
private int GameObjects = 0;
private int Components = 0;
private double TmpTime = 0.0d;
    void OnGUI () {
			if(Time.time > TmpTime) { 
				RefreshAll(); TmpTime = Time.time + 0.5;
			}
			GUILayout.Label("All " + All);
			GUILayout.Label("Textures " + Textures);
			GUILayout.Label("AudioClips " + AudioClips);
			GUILayout.Label("Meshes " + Meshes);
			GUILayout.Label("Materials " + Materials);
			GUILayout.Label("GameObjects " + GameObjects);
			GUILayout.Label("Components " + Components);
    }
	private void RefreshAll() {
		All = FindObjectsOfTypeAll(typeof(UnityEngine.Object)).Length;
		Textures = FindObjectsOfTypeAll(typeof(Texture)).Length;
		AudioClips = FindObjectsOfTypeAll(typeof(AudioClip)).Length;
		Meshes = FindObjectsOfTypeAll(typeof(Mesh)).Length;
		Materials = FindObjectsOfTypeAll(typeof(Material)).Length;
		GameObjects = FindObjectsOfTypeAll(typeof(GameObject)).Length;
		Components = FindObjectsOfTypeAll(typeof(Component)).Length;
	}
}