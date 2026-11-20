import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;

  varying vec2 vUv;
  uniform vec2 u_resolution;
  uniform float u_time;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute(
      permute(
        permute(i.z + vec4(0.0, i1.z, i2.z, 1.0))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0)
      )
      + i.x + vec4(0.0, i1.x, i2.x, 1.0)
    );

    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }

  float contourLine(float v, float levels, float widthPx) {
    float scaled = v * levels;
    float f = fract(scaled);
    float dist = min(f, 1.0 - f);
    float fw = max(fwidth(scaled), 0.0001);
    return 1.0 - smoothstep(0.0, widthPx * fw, dist);
  }

  void main() {
    float aspect = u_resolution.x / max(u_resolution.y, 1.0);
    vec2 p = vec2(vUv.x * aspect, vUv.y);

    float n1 = snoise(vec3(p * 1.65, u_time * 0.035));
    float n2 = snoise(vec3(p * 3.4 + 4.2, u_time * 0.025)) * 0.35;
    float elevation = (n1 + n2) * 0.5 + 0.5;

    float minor = contourLine(elevation, 18.0, 1.15);
    float major = contourLine(elevation, 3.6, 1.45);

    vec3 lineColor = vec3(0.0, 0.0, 0.0);
    float alpha = max(minor * 0.15, major * 0.26);

    gl_FragColor = vec4(lineColor, alpha);
  }
`;

export default function HeroGisBackground({ reducedMotion = false }) {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return undefined;

        let width = container.clientWidth || window.innerWidth;
        let height = container.clientHeight || window.innerHeight;

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(0, width, 0, height, 1, 3);
        camera.position.z = 2;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(width, height);
        container.appendChild(renderer.domElement);

        let geometry = new THREE.PlaneGeometry(width, height);
        geometry.translate(width / 2, height / 2, 0);

        const uniforms = {
            u_resolution: { value: new THREE.Vector2(width, height) },
            u_time: { value: 0 },
        };

        const material = new THREE.ShaderMaterial({
            uniforms,
            vertexShader: VERTEX_SHADER,
            fragmentShader: FRAGMENT_SHADER,
            side: THREE.DoubleSide,
            transparent: true,
        });

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        const handleResize = () => {
            const nextW = container.clientWidth || window.innerWidth;
            const nextH = container.clientHeight || window.innerHeight;
            if (nextW === width && nextH === height) return;

            width = nextW;
            height = nextH;

            camera.right = width;
            camera.bottom = height;
            camera.updateProjectionMatrix();

            renderer.setSize(width, height);
            uniforms.u_resolution.value.set(width, height);

            const nextGeom = new THREE.PlaneGeometry(width, height);
            nextGeom.translate(width / 2, height / 2, 0);
            mesh.geometry = nextGeom;
            geometry.dispose();
            geometry = nextGeom;
        };

        window.addEventListener('resize', handleResize);

        let rafId = 0;
        const clock = new THREE.Clock();

        const frame = () => {
            if (!reducedMotion) {
                uniforms.u_time.value = clock.getElapsedTime();
            }
            renderer.render(scene, camera);
            if (!reducedMotion) {
                rafId = requestAnimationFrame(frame);
            }
        };

        frame();

        return () => {
            if (rafId) cancelAnimationFrame(rafId);
            window.removeEventListener('resize', handleResize);
            geometry.dispose();
            material.dispose();
            renderer.dispose();
            if (renderer.domElement.parentNode === container) {
                container.removeChild(renderer.domElement);
            }
        };
    }, [reducedMotion]);

    return <div ref={containerRef} className="melius-hero_topo" aria-hidden="true" />;
}

