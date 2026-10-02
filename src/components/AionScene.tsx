'use client';

import { useEffect, useRef, useState, type MutableRefObject } from 'react';
import type { AionState } from './AionExperience';

export function AionScene({ state, volume, ar }: { state: AionState; volume: MutableRefObject<number>; ar: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const current = useRef(state);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => { current.current = state; }, [state]);
  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};
    async function setup() {
      const [T, { RoundedBoxGeometry }, { RoomEnvironment }] = await Promise.all([
        import('three'), import('three/addons/geometries/RoundedBoxGeometry.js'), import('three/addons/environments/RoomEnvironment.js'),
      ]);
      if (disposed || !host.current) return;
      const container = host.current;
      const renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = T.SRGBColorSpace;
      renderer.toneMapping = T.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      renderer.domElement.setAttribute('aria-hidden', 'true');
      container.appendChild(renderer.domElement);
      const scene = new T.Scene();
      const pmrem = new T.PMREMGenerator(renderer);
      const room = new RoomEnvironment();
      const environment = pmrem.fromScene(room, .04);
      scene.environment = environment.texture;
      room.dispose(); pmrem.dispose();
      const camera = new T.PerspectiveCamera(36, 1, .1, 30);
      camera.position.set(0, 1.95, 7.1); camera.lookAt(0, 1.78, 0);
      scene.add(new T.HemisphereLight(0xf0ffff, 0x56675f, 2));
      const key = new T.DirectionalLight(0xffffff, 3); key.position.set(-3, 5, 4); scene.add(key);
      const rim = new T.DirectionalLight(0x80fff0, 2); rim.position.set(3, 3, -3); scene.add(rim);
      const white = new T.MeshPhysicalMaterial({ color: 0xf7f9f8, metalness: .28, roughness: .24, clearcoat: .8 });
      const silver = new T.MeshStandardMaterial({ color: 0xbac8c9, metalness: .75, roughness: .3 });
      const black = new T.MeshStandardMaterial({ color: 0x101b23, metalness: .65, roughness: .3 });
      const cyan = new T.MeshStandardMaterial({ color: 0x00d1c1, emissive: 0x00d1c1, emissiveIntensity: 1.7 });
      const robot = new T.Group(); scene.add(robot); robot.rotation.y = -.16;
      const sphere = (parent: import('three').Object3D, x: number, y: number, z: number, sx: number, sy: number, sz: number, material: import('three').MeshStandardMaterial = white) => {
        const m = new T.Mesh(new T.SphereGeometry(1, 32, 24), material); m.position.set(x, y, z); m.scale.set(sx, sy, sz); parent.add(m); return m;
      };
      const box = (parent: import('three').Object3D, x: number, y: number, z: number, w: number, h: number, d: number, radius: number, material: import('three').MeshStandardMaterial = white) => {
        const m = new T.Mesh(new RoundedBoxGeometry(w, h, d, 4, radius), material); m.position.set(x, y, z); parent.add(m); return m;
      };
      const ring = (parent: import('three').Object3D, x: number, y: number, z: number, radius: number, thickness: number, material = cyan) => {
        const m = new T.Mesh(new T.TorusGeometry(radius, thickness, 10, 48), material); m.position.set(x, y, z); parent.add(m); return m;
      };
      // Separated armor and mechanical joints make the embodiment independently articulate.
      sphere(robot, 0, 1.64, 0, .46, .52, .29, black);
      sphere(robot, 0, 1.85, .025, .53, .51, .32);
      box(robot, 0, 1.44, .27, .35, .24, .05, .025, black);
      box(robot, 0, 1.47, .306, .21, .035, .018, .009, cyan);
      sphere(robot, 0, 1.14, 0, .34, .25, .28, black);
      sphere(robot, 0, 1.17, .14, .35, .18, .22);
      box(robot, 0, 2.32, 0, .22, .24, .23, .04, black);
      ring(robot, 0, 2.27, 0, .15, .014).rotation.x = Math.PI / 2;
      const head = new T.Group(); head.position.y = 2.91; robot.add(head);
      sphere(head, 0, .02, 0, .81, .69, .62);
      box(head, 0, -.06, .49, 1.34, .89, .25, .23, black);
      const faceCanvas = document.createElement('canvas'); faceCanvas.width = 512; faceCanvas.height = 320;
      const ctx = faceCanvas.getContext('2d')!;
      const faceTexture = new T.CanvasTexture(faceCanvas); faceTexture.colorSpace = T.SRGBColorSpace;
      const face = new T.Mesh(new T.PlaneGeometry(1.19, .70), new T.MeshBasicMaterial({ map: faceTexture, transparent: true, depthWrite: false }));
      face.position.set(0, -.04, .625); head.add(face);
      // A small reflection strip and crown seam preserve the glossy visor silhouette.
      box(head, -.28, .25, .624, .42, .018, .004, .008, silver).rotation.z = .07;
      box(head, 0, .59, .18, .25, .035, .04, .012, black);
      box(head, 0, .59, .208, .12, .014, .012, .004, cyan);
      for (const sign of [-1, 1]) {
        sphere(head, sign * .78, .02, -.02, .19, .37, .34, black);
        const ear = ring(head, sign * .91, .02, -.02, .255, .023); ear.rotation.y = Math.PI / 2;
        const earPlate = new T.Mesh(new T.CylinderGeometry(.21, .21, .055, 40), silver); earPlate.rotation.z = Math.PI / 2; earPlate.position.set(sign * .94, .02, -.02); head.add(earPlate);
        sphere(head, sign * .98, .02, -.02, .015, .15, .15, black);
      }
      const arms: import('three').Group[] = [];
      for (const sign of [-1, 1]) {
        const arm = new T.Group(); arm.position.set(sign * .56, 2.06, 0); robot.add(arm); arms.push(arm);
        sphere(arm, 0, 0, 0, .23, .24, .24, black);
        sphere(arm, sign * .05, .025, .035, .24, .22, .24);
        const joint = ring(arm, sign * .15, 0, 0, .175, .014); joint.rotation.y = Math.PI / 2;
        box(arm, sign * .09, -.35, 0, .24, .48, .26, .10);
        sphere(arm, sign * .1, -.62, .015, .145, .145, .145, black);
        ring(arm, sign * .1, -.62, .14, .10, .012);
        box(arm, sign * .1, -.88, .04, .23, .38, .25, .09);
        box(arm, sign * .10, -1.12, .06, .20, .19, .15, .05, black);
        box(arm, sign * .10, -1.10, .14, .18, .14, .06, .035);
        for (let i = 0; i < 4; i++) { box(arm, sign * .1 + (i - 1.5) * .047, -1.24, .085, .033, .16, .055, .015, silver); }
        for (let i = 0; i < 2; i++) {
          const hipX = sign * .20;
          if (i === 0) { sphere(robot, hipX, .99, 0, .14, .14, .15, black); box(robot, hipX, .76, 0, .26, .43, .28, .09); }
          else { sphere(robot, hipX, .50, .04, .14, .14, .15, black); ring(robot, hipX, .50, .18, .09, .012); box(robot, hipX, .28, .015, .23, .35, .26, .08); box(robot, hipX, .065, .10, .29, .13, .46, .055); }
        }
      }
      // Chest branding is a texture on geometry, not a flattened character image.
      const label = document.createElement('canvas'); label.width = 512; label.height = 128;
      const lc = label.getContext('2d')!; lc.font = '500 70px sans-serif'; lc.textAlign = 'center'; lc.fillStyle = '#0f172a'; lc.fillText('A I O N', 256, 78);
      const labelTexture = new T.CanvasTexture(label); labelTexture.colorSpace = T.SRGBColorSpace;
      const labelMesh = new T.Mesh(new T.PlaneGeometry(.44, .11), new T.MeshBasicMaterial({ map: labelTexture, transparent: true })); labelMesh.position.set(0, 1.96, .341); robot.add(labelMesh);
      const pedestal = new T.Mesh(new T.CylinderGeometry(.89, .96, .06, 64), new T.MeshStandardMaterial({ color: 0xd7e4df, metalness: .4, roughness: .4 })); pedestal.position.y = -.035; scene.add(pedestal);
      const baseRing = ring(scene, 0, .001, 0, .9, .007); baseRing.rotation.x = Math.PI / 2;
      let pointerX = 0, pointerY = 0, yaw = -.16, dragX = 0, dragging = false, previousX = 0;
      const onMove = (event: PointerEvent) => {
        const bounds = container.getBoundingClientRect();
        pointerX = (event.clientX - bounds.left) / bounds.width * 2 - 1;
        pointerY = (event.clientY - bounds.top) / bounds.height * 2 - 1;
        if (dragging) { dragX += (event.clientX - previousX) * .006; previousX = event.clientX; }
      };
      const down = (event: PointerEvent) => { dragging = true; previousX = event.clientX; container.setPointerCapture(event.pointerId); };
      const up = () => { dragging = false; };
      const leave = () => { if (!dragging) { pointerX = 0; pointerY = 0; } };
      container.addEventListener('pointermove', onMove); container.addEventListener('pointerdown', down); container.addEventListener('pointerup', up); container.addEventListener('pointercancel', up); container.addEventListener('pointerleave', leave);
      const resize = new ResizeObserver(() => { const w = container.clientWidth; const h = container.clientHeight; renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix(); }); resize.observe(container);
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
      const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }); let visible = true; visibility.observe(container);
      let frame = 0, lastTexture = -1, active = true;
      const start = performance.now();
      function drawFace(time: number) {
        const mode = current.current;
        ctx.clearRect(0, 0, 512, 320); ctx.strokeStyle = '#72fff0'; ctx.lineWidth = 17; ctx.lineCap = 'round'; ctx.shadowColor = '#00d1c1'; ctx.shadowBlur = 20;
        const blink = !reduced.matches && time % 5.4 > 5.25;
        for (const x of [153, 359]) {
          ctx.beginPath();
          if (blink || mode === 'thinking' || (mode === 'wink' && x === 359)) { ctx.moveTo(x - 35, 151); ctx.lineTo(x + 35, 151); }
          else if (mode === 'listening') { ctx.moveTo(x, 121); ctx.lineTo(x, 178); }
          else if (mode === 'curious') { ctx.ellipse(x, 145, 32, 39, 0, 0, Math.PI * 2); }
          else { ctx.moveTo(x - 39, 158); ctx.quadraticCurveTo(x, 98 - (mode === 'speaking' ? volume.current * 25 : 0), x + 39, 158); }
          ctx.stroke();
        }
        if (mode === 'speaking') { ctx.lineWidth = 6; for (let i = 0; i < 5; i++) { const h = 5 + volume.current * (12 + (2 - Math.abs(i - 2)) * 9); ctx.beginPath(); ctx.moveTo(228 + i * 14, 227 - h / 2); ctx.lineTo(228 + i * 14, 227 + h / 2); ctx.stroke(); } }
        faceTexture.needsUpdate = true;
      }
      function animate(now: number) {
        if (!active) return; frame = requestAnimationFrame(animate);
        if (document.hidden || !visible) return;
        const time = (now - start) / 1000;
        if (now - lastTexture > 80) { drawFace(time); lastTexture = now; }
        yaw = T.MathUtils.lerp(yaw, dragX - .16, .06); robot.rotation.y = yaw;
        head.rotation.y = T.MathUtils.lerp(head.rotation.y, reduced.matches ? 0 : pointerX * .20, .07);
        head.rotation.x = T.MathUtils.lerp(head.rotation.x, reduced.matches ? 0 : pointerY * .10, .07);
        head.rotation.z = reduced.matches ? 0 : current.current === 'curious' ? .14 : current.current === 'thinking' ? -.12 : Math.sin(time * .8) * .018;
        robot.position.y = reduced.matches ? 0 : Math.sin(time * 1.4) * .018;
        arms[0].rotation.z = -.10;
        arms[1].rotation.z = reduced.matches ? .1 : current.current === 'wink' ? 2.35 + Math.sin(time * 5) * .16 : current.current === 'speaking' ? .22 + Math.sin(time * 2.3) * .12 : .10;
        cyan.emissiveIntensity = 1.5 + (current.current === 'speaking' ? volume.current : .1);
        renderer.render(scene, camera);
      }
      frame = requestAnimationFrame(animate); setReady(true);
      cleanup = () => {
        active = false; cancelAnimationFrame(frame); resize.disconnect(); visibility.disconnect();
        container.removeEventListener('pointermove', onMove); container.removeEventListener('pointerdown', down); container.removeEventListener('pointerup', up); container.removeEventListener('pointercancel', up); container.removeEventListener('pointerleave', leave);
        scene.traverse(node => { if (node instanceof T.Mesh) { node.geometry.dispose(); const materials = Array.isArray(node.material) ? node.material : [node.material]; materials.forEach(m => m.dispose()); } });
        faceTexture.dispose(); labelTexture.dispose(); environment.dispose(); renderer.dispose(); renderer.domElement.remove();
      };
    }
    setup().catch(() => { if (!disposed) setFailed(true); });
    return () => { disposed = true; cleanup(); };
  }, [volume]);

  return <div className="aion-viewport" ref={host} role="img" aria-label={ar ? 'شخصية AION ثلاثية الأبعاد بدرع أبيض وإضاءة تركواز. اسحب لتدويرها.' : 'AION in white armor with turquoise lights. Drag to rotate.'}>
    {!ready && <div className="aion-static"><svg width="240" height="180" viewBox="0 0 240 180" aria-hidden="true"><ellipse cx="28" cy="82" rx="18" ry="32" fill="#0F172A"/><ellipse cx="212" cy="82" rx="18" ry="32" fill="#0F172A"/><rect x="33" y="15" width="174" height="137" rx="64" fill="#fff" stroke="#0F172A" strokeWidth="2"/><rect x="45" y="43" width="150" height="95" rx="39" fill="#0F172A"/><path d="M68 83Q82 61 98 83M142 83Q158 61 172 83" fill="none" stroke="#00D1C1" strokeWidth="6" strokeLinecap="round"/></svg><p>{failed ? (ar ? 'العرض ثلاثي الأبعاد غير متاح على هذا الجهاز. المحادثة متاحة.' : '3D is unavailable on this device. Conversation is still available.') : (ar ? 'تجهيز AION…' : 'Preparing AION…')}</p></div>}
  </div>;
}
