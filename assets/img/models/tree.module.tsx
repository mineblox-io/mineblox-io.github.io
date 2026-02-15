// TreeMerge.ts
import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export function createMergedTree(): THREE.Mesh {
  // 1) Create trunk geometry (BufferGeometry)
  const trunkGeom = new THREE.CylinderGeometry(0.25, 0.5, 3, 12);
  trunkGeom.translate(0, 1.5, 0); // move base to y=0

  // 2) Create a single leaf geometry (BufferGeometry)
  const leafGeomBase = new THREE.SphereGeometry(0.6, 8, 6);
  // Optionally scale to make it leaf-like
  leafGeomBase.scale(1.4, 0.8, 1.0);

  // 3) Create transformed clones of leaf geometry
  const leafGeoms: THREE.BufferGeometry[] = [];
  const leafPositions = [
    new THREE.Vector3(0, 3.0, 0),
    new THREE.Vector3(0.6, 2.6, 0.2),
    new THREE.Vector3(-0.6, 2.4, -0.3),
  ];

  for (const pos of leafPositions) {
    const g = leafGeomBase.clone();
    const m = new THREE.Matrix4();
    // random rotation and scale example
    const rot = new THREE.Euler(
      Math.random() * 0.6 - 0.3,
      Math.random() * Math.PI * 2,
      Math.random() * 0.6 - 0.3
    );
    m.makeRotationFromEuler(rot);
    m.setPosition(pos);
    g.applyMatrix4(m);
    leafGeoms.push(g);
  }

  // 4) Merge trunk + leaves into one BufferGeometry
  const allGeoms = [trunkGeom, ...leafGeoms];
  const merged = BufferGeometryUtils.mergeGeometries(allGeoms, false);
  if (!merged) throw new Error('Merge failed');

  // 5) Compute normals and bounding info
  merged.computeVertexNormals();
  merged.computeBoundingSphere();

  // 6) Create material and mesh
  const material = new THREE.MeshStandardMaterial({ color: 0x8b5a2b });
  const mesh = new THREE.Mesh(merged, material);

  // 7) Dispose intermediate geometries to free memory
  trunkGeom.dispose();
  leafGeomBase.dispose();
  leafGeoms.forEach(g => g.dispose());

  return mesh;
}
