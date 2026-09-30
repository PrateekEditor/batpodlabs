import * as THREE from 'three'

/**
 * A MeshStandardMaterial subclass that reveals the mesh progressively from
 * the bottom up, driven by `uProgress` (0 = fully hidden, 1 = fully solid),
 * with a glowing edge at the reveal front. Used for the "materializing"
 * hologram effect — implemented via onBeforeCompile so normal PBR lighting
 * still applies to the revealed portion, rather than a flat unlit shader.
 */
export class DissolveMaterial extends THREE.MeshStandardMaterial {
  uniforms: {
    uProgress: { value: number }
    uEdgeColor: { value: THREE.Color }
    uEdgeWidth: { value: number }
    // Raw vertex coordinates aren't necessarily in a normalized range (a
    // model can have a huge scale baked into its node transform instead of
    // its geometry), so the reveal height-bias needs the mesh's own local
    // min/max Y to normalize against, rather than assuming -1..1.
    uMinY: { value: number }
    uMaxY: { value: number }
  }

  constructor(params: THREE.MeshStandardMaterialParameters = {}) {
    super(params)
    this.uniforms = {
      uProgress: { value: 0 },
      uEdgeColor: { value: new THREE.Color('#5fd8ff') },
      uEdgeWidth: { value: 0.1 },
      uMinY: { value: 0 },
      uMaxY: { value: 1 },
    }

    this.onBeforeCompile = (shader) => {
      shader.uniforms.uProgress = this.uniforms.uProgress
      shader.uniforms.uEdgeColor = this.uniforms.uEdgeColor
      shader.uniforms.uEdgeWidth = this.uniforms.uEdgeWidth
      shader.uniforms.uMinY = this.uniforms.uMinY
      shader.uniforms.uMaxY = this.uniforms.uMaxY

      shader.vertexShader = shader.vertexShader
        .replace(
          '#include <common>',
          `#include <common>\nvarying vec3 vDissolvePos;`,
        )
        .replace(
          '#include <begin_vertex>',
          `#include <begin_vertex>\nvDissolvePos = position;`,
        )

      shader.fragmentShader = shader.fragmentShader
        .replace(
          '#include <common>',
          `#include <common>
          varying vec3 vDissolvePos;
          uniform float uProgress;
          uniform vec3 uEdgeColor;
          uniform float uEdgeWidth;
          uniform float uMinY;
          uniform float uMaxY;

          float dHash(vec3 p) {
            return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453123);
          }
          float dNoise(vec3 p) {
            vec3 i = floor(p);
            vec3 f = fract(p);
            f = f * f * (3.0 - 2.0 * f);
            float n000 = dHash(i);
            float n100 = dHash(i + vec3(1.0, 0.0, 0.0));
            float n010 = dHash(i + vec3(0.0, 1.0, 0.0));
            float n110 = dHash(i + vec3(1.0, 1.0, 0.0));
            float n001 = dHash(i + vec3(0.0, 0.0, 1.0));
            float n101 = dHash(i + vec3(1.0, 0.0, 1.0));
            float n011 = dHash(i + vec3(0.0, 1.0, 1.0));
            float n111 = dHash(i + vec3(1.0, 1.0, 1.0));
            return mix(
              mix(mix(n000, n100, f.x), mix(n010, n110, f.x), f.y),
              mix(mix(n001, n101, f.x), mix(n011, n111, f.x), f.y),
              f.z
            );
          }`,
        )
        .replace(
          '#include <dithering_fragment>',
          `#include <dithering_fragment>
          float dScale = 1.0 / max(uMaxY - uMinY, 0.0001);
          vec3 dPos = vDissolvePos * dScale;
          float dGrain = dNoise(dPos * 7.0 + vec3(0.0, dPos.y * 1.5, 0.0));
          float dHeight = (vDissolvePos.y - uMinY) * dScale;
          float dMask = dGrain * 0.3 + dHeight * 0.7;
          float dThreshold = uProgress * 1.25 - 0.12;
          if (dMask > dThreshold) discard;
          float dEdge = 1.0 - smoothstep(dThreshold - uEdgeWidth, dThreshold, dMask);
          dEdge = 1.0 - dEdge;
          gl_FragColor.rgb = mix(gl_FragColor.rgb, uEdgeColor, dEdge * 0.85);
          gl_FragColor.rgb += uEdgeColor * dEdge * dEdge * 1.4;`,
        )
    }
  }
}
