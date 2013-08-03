// Upgrade NOTE: replaced 'glstate.matrix.modelview[0]' with 'UNITY_MATRIX_MV'
// Upgrade NOTE: replaced 'glstate.matrix.mvp' with 'UNITY_MATRIX_MVP'
// Upgrade NOTE: replaced 'glstate.matrix.projection' with 'UNITY_MATRIX_P'

Shader "Toon/Basic Outline" {
	Properties {
		_Color ("Main Color", Color) = (1,1,1,0)
		_OutlineColor ("Outline Color", Color) = (1,0.2,0.1,0.65)
		_Outline ("Outline width", Range (.002, 0.03)) = .03
		_MainTex ("Base (RGB)", 2D) = "white" { }
		_ToonShade ("ToonShader Cubemap(RGB)", CUBE) = "" { Texgen CubeNormal }
	}

	SubShader {
		Tags { "RenderType"="Opaque" }
		UsePass "Toon/Basic/BASE"
		Pass {
			Name "OUTLINE"
			Tags { "LightMode" = "Always" }
CGPROGRAM
// Upgrade NOTE: excluded shader from OpenGL ES 2.0 because it does not contain a surface program or both vertex and fragment programs.
#pragma exclude_renderers gles
// Upgrade NOTE: excluded shader from DX11 and Xbox360; has structs without semantics (struct appdata members vertex,normal)
#pragma exclude_renderers d3d11 xbox360
#pragma vertex vert

struct appdata {
    float4 vertex;
    float3 normal;
};

struct v2f {
	float4 pos : POSITION;
	float4 color : COLOR;
	float fog : FOGC;
};
uniform float _Outline;
uniform float4 _OutlineColor;

v2f vert(appdata v) {
	v2f o;
	o.pos = mul(UNITY_MATRIX_MVP, v.vertex);
	float3 norm = mul ((float3x3)UNITY_MATRIX_MV, v.normal);
	norm.x *= UNITY_MATRIX_P[0][0];
	norm.y *= UNITY_MATRIX_P[1][1];
	o.pos.xy += norm.xy * _Outline;
	
	o.color = _OutlineColor;
	return o;
}
ENDCG
			//Color (0,0,0,0)
			Cull Front
			ZWrite On
			ColorMask RGB
			Blend SrcAlpha OneMinusSrcAlpha
			SetTexture [_MainTex] { combine primary }
		}
	}
	
	Fallback "Toon/Basic"
}