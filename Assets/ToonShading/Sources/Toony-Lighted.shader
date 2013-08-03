// Upgrade NOTE: replaced 'PositionFog()' with multiply of UNITY_MATRIX_MVP by position
// Upgrade NOTE: replaced 'V2F_POS_FOG' with 'float4 pos : SV_POSITION'
// Upgrade NOTE: replaced 'glstate.matrix.texture[0]' with 'UNITY_MATRIX_TEXTURE0'

Shader "Toon/Lighted" {
	Properties {
		_Color ("Main Color", Color) = (0.5,0.5,0.5,1)
		_MainTex ("Base (RGB)", 2D) = "white" {}
		_ToonShade ("Toon Cubemap (RGB)", CUBE) = "" { Texgen CubeReflect }
	}

	#warning Upgrade NOTE: SubShader commented out; uses Unity 2.x per-pixel lighting. You should rewrite shader into a Surface Shader.
/*SubShader {
		Tags { "RenderType"="Opaque" }
		/* Upgrade NOTE: commented out, possibly part of old style per-pixel lighting: Blend AppSrcAdd AppDstAdd */
		Fog { Color [_AddFog] }
		
		// Ambient pass
        Pass {
			Name "BASE"
            Tags {"LightMode" = "Always" /* Upgrade NOTE: changed from PixelOrNone to Always */}
            Color [_PPLAmbient]
            SetTexture [_MainTex] {constantColor [_Color] Combine primary DOUBLE, constant}
        }
        // Vertex lights
        Pass {
			Name "BASE"
            Tags {"LightMode" = "Vertex"}
            Color [_PPLAmbient]
            SetTexture [_MainTex] {constantColor [_Color] Combine primary DOUBLE, constant}
        }
        // Pixel lights (directional only)
        Pass {
			Name "PPL"
			Tags { "LightMode" = "Pixel" }
CGPROGRAM
// Upgrade NOTE: excluded shader from OpenGL ES 2.0 because it does not contain a surface program or both vertex and fragment programs.
#pragma exclude_renderers gles
// Upgrade NOTE: excluded shader from DX11 and Xbox360; has structs without semantics (struct appdata members vertex,normal,texcoord)
#pragma exclude_renderers d3d11 xbox360
#pragma vertex vert
#include "UnityCG.cginc"

struct appdata {
    float4 vertex;
    float3 normal;
    float4 texcoord;
};

struct v2f {
	float4 pos : SV_POSITION;
	float4 color : COLOR;
	float3 uv0;
	float4 uv1;
};
v2f vert(appdata_base v)
{
	v2f o;
	o.pos = mul (UNITY_MATRIX_MVP, v.vertex);
	o.uv1 = mul (UNITY_MATRIX_TEXTURE0, v.texcoord);
	o.uv0 = mul ((float3x3)_Object2Light0, -v.normal);
	return o;
}
ENDCG
			Color (0,0,0,0)
			Cull Back
			SetTexture [_ToonShade] {
				constantColor [_ModelLightColor0]
				combine texture * constant
			}
			SetTexture [_MainTex] {
				combine texture * previous DOUBLE
			}
		}
	}*/ 

	Fallback " VertexLit"
}
