import * as THREE from 'three';
import { SpecificRole } from '../types/game';

/**
 * Procedural 3D Character Assembly (3-12 parts)
 * Bottom-center pivot so characters sit flush on ground
 */

export interface CharacterMeshGroup extends THREE.Group {
  userData: {
    playerId: string;
    isAlive: boolean;
    lanternLight?: THREE.PointLight;
    headGroup?: THREE.Group;
    bodyMesh?: THREE.Mesh;
    robeColor: string;
    role: SpecificRole;
    walkCycle: number;
    leftLeg?: THREE.Mesh;
    rightLeg?: THREE.Mesh;
    leftArm?: THREE.Group;
    rightArm?: THREE.Group;
  };
}

export function groundHeightAt(x: number, z: number): number {
  // Calabouço/Cripta is slightly sunken (-0.8m)
  if (x >= -32 && x <= -10 && z >= -12 && z <= 8) {
    return -0.8;
  }
  // Altar steps rise (+0.5m)
  if (x >= -8 && x <= 8 && z >= 36 && z <= 50) {
    return 0.5;
  }
  // Base floor
  return 0.0;
}

export function createCharacterModel(
  playerId: string,
  robeColorHex: string,
  role: SpecificRole,
  isHuman: boolean
): CharacterMeshGroup {
  const group = new THREE.Group() as CharacterMeshGroup;
  group.userData = {
    playerId,
    isAlive: true,
    robeColor: robeColorHex,
    role,
    walkCycle: Math.random() * Math.PI * 2,
  };

  const isNun = role === 'evil_nun';
  const isAssistant = role === 'evil_assistant';

  // Materials
  const habitColor = isNun ? '#09090b' : robeColorHex;
  const habitMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(habitColor),
    roughness: 0.85,
    metalness: 0.05,
  });

  const skinMaterial = new THREE.MeshStandardMaterial({
    color: isNun ? 0xd1d5db : 0xe0a980,
    roughness: 0.6,
  });

  const cowlMaterial = new THREE.MeshStandardMaterial({
    color: isNun ? 0x09090b : new THREE.Color(habitColor).multiplyScalar(0.85),
    roughness: 0.9,
  });

  const cordMaterial = new THREE.MeshStandardMaterial({
    color: 0xd4d4d8,
    roughness: 0.7,
  });

  const metalMaterial = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    metalness: 0.8,
    roughness: 0.25,
  });

  // 1. Lower Body / Robe Skirt (Part 1 - conical tapered skirt)
  const skirtGeom = new THREE.CylinderGeometry(0.38, 0.5, 0.9, 12);
  skirtGeom.translate(0, 0.45, 0);
  const skirt = new THREE.Mesh(skirtGeom, habitMaterial);
  skirt.castShadow = true;
  group.add(skirt);
  group.userData.bodyMesh = skirt;

  // 2. Torso / Upper Habit (Part 2)
  const torsoGeom = new THREE.CylinderGeometry(0.32, 0.38, 0.65, 12);
  torsoGeom.translate(0, 1.15, 0);
  const torso = new THREE.Mesh(torsoGeom, habitMaterial);
  torso.castShadow = true;
  group.add(torso);

  // 3. Monastic Cord Belt / Cincture (Part 3)
  const cordGeom = new THREE.TorusGeometry(0.36, 0.04, 8, 16);
  cordGeom.rotateX(Math.PI / 2);
  cordGeom.translate(0, 0.9, 0);
  const cord = new THREE.Mesh(cordGeom, cordMaterial);
  group.add(cord);

  // 4. Head Group (Part 4)
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.5, 0);

  // Face head sphere
  const faceGeom = new THREE.SphereGeometry(0.24, 12, 10);
  const faceMesh = new THREE.Mesh(faceGeom, skinMaterial);
  headGroup.add(faceMesh);

  if (isNun) {
    // Evil Nun White Wimple (Part 5)
    const wimpleGeom = new THREE.CylinderGeometry(0.26, 0.28, 0.35, 12);
    wimpleGeom.translate(0, -0.05, 0);
    const wimpleMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.6 });
    const wimple = new THREE.Mesh(wimpleGeom, wimpleMat);
    headGroup.add(wimple);

    // Dark Veil draped over head (Part 6)
    const veilGeom = new THREE.ConeGeometry(0.36, 0.8, 12);
    veilGeom.translate(0, 0.15, -0.05);
    const veil = new THREE.Mesh(veilGeom, cowlMaterial);
    headGroup.add(veil);

    // Glowing Red Sinister Eyes
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), eyeMat);
    leftEye.position.set(-0.09, 0.04, 0.21);
    const rightEye = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), eyeMat);
    rightEye.position.set(0.09, 0.04, 0.21);
    headGroup.add(leftEye, rightEye);
  } else {
    // Monk Cowl / Hood draped over back and head
    const hoodGeom = new THREE.SphereGeometry(0.29, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.7);
    hoodGeom.translate(0, 0.04, -0.04);
    const hood = new THREE.Mesh(hoodGeom, cowlMaterial);
    headGroup.add(hood);

    // Curious Monk Eyes
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x1e293b });
    const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.03, 6, 6), eyeMat);
    leftEye.position.set(-0.08, 0.02, 0.21);
    const rightEye = new THREE.Mesh(new THREE.SphereGeometry(0.03, 6, 6), eyeMat);
    rightEye.position.set(0.08, 0.02, 0.21);
    headGroup.add(leftEye, rightEye);
  }

  group.add(headGroup);
  group.userData.headGroup = headGroup;

  // 5. Wooden / Golden Pectoral Cross (Part 7)
  const crossGroup = new THREE.Group();
  const vBar = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.16, 0.02), metalMaterial);
  const hBar = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.03, 0.02), metalMaterial);
  hBar.position.y = 0.03;
  crossGroup.add(vBar, hBar);
  crossGroup.position.set(0, 1.1, 0.35);
  group.add(crossGroup);

  // 6. Right Arm + Handheld Brass Lantern (Part 8-10)
  const rightArm = new THREE.Group();
  rightArm.position.set(0.38, 1.3, 0);
  const sleeveGeom = new THREE.CylinderGeometry(0.08, 0.12, 0.5, 8);
  sleeveGeom.translate(0, -0.22, 0);
  const sleeve = new THREE.Mesh(sleeveGeom, habitMaterial);
  rightArm.add(sleeve);

  // Brass Lantern
  const lantern = new THREE.Group();
  lantern.position.set(0.05, -0.45, 0.25);

  const lanternCap = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.08, 6), metalMaterial);
  lanternCap.position.y = 0.1;
  const lanternGlass = new THREE.Mesh(
    new THREE.CylinderGeometry(0.07, 0.07, 0.14, 6),
    new THREE.MeshBasicMaterial({ color: isNun ? 0xff4444 : 0xfef08a, transparent: true, opacity: 0.85 })
  );
  lantern.add(lanternCap, lanternGlass);

  // Real-time point light for night illumination
  const lanternLight = new THREE.PointLight(isNun ? 0xff3333 : 0xffaa44, isHuman ? 2.2 : 1.2, isHuman ? 10 : 6);
  lanternLight.position.set(0, 0, 0);
  lanternLight.castShadow = false; // keep perf high
  lantern.add(lanternLight);
  group.userData.lanternLight = lanternLight;

  rightArm.add(lantern);
  group.add(rightArm);
  group.userData.rightArm = rightArm;

  // 7. Left Arm (Part 11)
  const leftArm = new THREE.Group();
  leftArm.position.set(-0.38, 1.3, 0);
  const leftSleeve = new THREE.Mesh(sleeveGeom.clone(), habitMaterial);
  leftArm.add(leftSleeve);
  group.add(leftArm);
  group.userData.leftArm = leftArm;

  // 8. Contact Ground Shadow (Part 12)
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 64;
  shadowCanvas.height = 64;
  const sCtx = shadowCanvas.getContext('2d')!;
  const grad = sCtx.createRadialGradient(32, 32, 0, 32, 32, 30);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.6)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  sCtx.fillStyle = grad;
  sCtx.fillRect(0, 0, 64, 64);
  const shadowTex = new THREE.CanvasTexture(shadowCanvas);
  const shadowPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(1.2, 1.2),
    new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: 0.7 })
  );
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.y = 0.02;
  group.add(shadowPlane);

  return group;
}

/**
 * Creates fallen monk corpse model when killed
 */
export function createDeadBodyModel(playerName: string, robeColorHex: string): THREE.Group {
  const group = new THREE.Group();
  group.userData = { isBody: true, playerName };

  const habitMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(robeColorHex),
    roughness: 0.9,
  });

  // Fallen flat habit robe
  const robeMesh = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.22, 1.3), habitMat);
  robeMesh.position.set(0, 0.11, 0);
  robeMesh.castShadow = true;
  group.add(robeMesh);

  // Fallen cowl
  const cowlMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.24, 10, 8),
    new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.9 })
  );
  cowlMesh.position.set(0, 0.14, -0.6);
  group.add(cowlMesh);

  // Broken extinguished lantern
  const brokenLantern = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 0.12, 6),
    new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.5 })
  );
  brokenLantern.rotation.z = Math.PI / 3;
  brokenLantern.position.set(0.45, 0.06, 0.2);
  group.add(brokenLantern);

  // Red sacrificial pool / dark shadow
  const bloodMat = new THREE.MeshBasicMaterial({ color: 0x450a0a, transparent: true, opacity: 0.8 });
  const pool = new THREE.Mesh(new THREE.CircleGeometry(0.65, 16), bloodMat);
  pool.rotation.x = -Math.PI / 2;
  pool.position.y = 0.015;
  group.add(pool);

  return group;
}
