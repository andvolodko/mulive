Shader "Toon/Lighted Outline" {
	Properties {
		_Color ("Main Color", Color) = (0.5,0.5,0.5,1)
		_OutlineColor ("Outline Color", Color) = (0,0,0,1)
		_Outline ("Outline width", Range (.002, 0.03)) = .005
		_MainTex ("Base (RGB)", 2D) = "white" {}
		_ToonShade ("Toon Cubemap (RGB)", CUBE) = "" { Texgen CubeReflect }
	}

	SubShader {
		Tags { "RenderType"="Opaque" }
		UsePass "Toon/Lighted/BASE"
		UsePass "Toon/Lighted/PPL"
		UsePass "Toon/Basic Outline/OUTLINE"
	} 
	
	Fallback "Toon/Lighted"
} 