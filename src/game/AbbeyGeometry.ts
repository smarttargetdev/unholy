import * as THREE from 'three';
import { 
  createStoneCobblestoneTexture, 
  createGothicStainedGlassTexture, 
  createStoneWallTexture 
} from './proceduralTextures';
import { TaskDefinition, VentLocation } from '../types/game';
import { VENT_LOCATIONS } from './abbeyData';

export interface AbbeySceneObjects {
  rootGroup: THREE.Group;
  taskObjects: Map<string, THREE.Object3D>;
  ventObjects: Map<string, THREE.Object3D>;
  flickerLights: THREE.PointLight[];
  stainedGlassLight: THREE.SpotLight | null;
  dungeonTorches: THREE.PointLight[];
}

export function buildAbbeyEnvironment(
  tasks: TaskDefinition[]
): AbbeySceneObjects {
  const rootGroup = new THREE.Group();
  const taskObjects = new Map<string, THREE.Object3D>();
  const ventObjects = new Map<string, THREE.Object3D>();
  const flickerLights: THREE.PointLight[] = [];
  const dungeonTorches: THREE.PointLight[] = [];

  // Textures
  const stoneFloorTex = createStoneCobblestoneTexture();
  stoneFloorTex.repeat.set(12, 12);
  const wallTex = createStoneWallTexture();
  wallTex.repeat.set(6, 4);
  const stainedGlassTex = createGothicStainedGlassTexture();

  // Materials
  const floorMat = new THREE.MeshStandardMaterial({
    map: stoneFloorTex,
    roughness: 0.85,
    metalness: 0.1,
  });

  const dungeonFloorMat = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    roughness: 0.95,
  });

  const grassMat = new THREE.MeshStandardMaterial({
    color: 0x142015,
    roughness: 0.9,
  });

  const cemeteryDirtMat = new THREE.MeshStandardMaterial({
    color: 0x1a1615,
    roughness: 0.95,
  });

  const wallMat = new THREE.MeshStandardMaterial({
    map: wallTex,
    roughness: 0.85,
    metalness: 0.1,
  });

  const archStoneMat = new THREE.MeshStandardMaterial({
    color: 0x3f3f46,
    roughness: 0.75,
  });

  const woodPewMat = new THREE.MeshStandardMaterial({
    color: 0x3d271d,
    roughness: 0.7,
  });

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.85,
    roughness: 0.2,
  });

  const bronzeMat = new THREE.MeshStandardMaterial({
    color: 0xb45309,
    metalness: 0.9,
    roughness: 0.3,
  });

  const ironMat = new THREE.MeshStandardMaterial({
    color: 0x27272a,
    metalness: 0.75,
    roughness: 0.4,
  });

  // ==========================================
  // 1. TERRAINS & FLOORS
  // ==========================================

  // Main Church Floor (Latin Cross Shape composed of Nave, Transepts, Altar)
  // Nave Floor
  const naveFloor = new THREE.Mesh(new THREE.PlaneGeometry(16, 28), floorMat);
  naveFloor.rotation.x = -Math.PI / 2;
  naveFloor.position.set(0, 0, 14);
  naveFloor.receiveShadow = true;
  rootGroup.add(naveFloor);

  // Altar-Mor Floor (Elevated +0.5m)
  const altarFloor = new THREE.Mesh(new THREE.BoxGeometry(16, 0.5, 22), floorMat);
  altarFloor.position.set(0, 0.25, 39);
  altarFloor.receiveShadow = true;
  rootGroup.add(altarFloor);

  // Transept Left: Sacristia Floor
  const sacristiaFloor = new THREE.Mesh(new THREE.PlaneGeometry(20, 14), floorMat);
  sacristiaFloor.rotation.x = -Math.PI / 2;
  sacristiaFloor.position.set(-18, 0, 21);
  sacristiaFloor.receiveShadow = true;
  rootGroup.add(sacristiaFloor);

  // Transept Right: Torre dos Sinos Floor
  const torreFloor = new THREE.Mesh(new THREE.PlaneGeometry(20, 14), floorMat);
  torreFloor.rotation.x = -Math.PI / 2;
  torreFloor.position.set(18, 0, 21);
  torreFloor.receiveShadow = true;
  rootGroup.add(torreFloor);

  // Calabouço / Cripta Floor (Sunken -0.8m)
  const cryptFloor = new THREE.Mesh(new THREE.PlaneGeometry(22, 20), dungeonFloorMat);
  cryptFloor.rotation.x = -Math.PI / 2;
  cryptFloor.position.set(-21, -0.8, -2);
  cryptFloor.receiveShadow = true;
  rootGroup.add(cryptFloor);

  // Cemitério Ground
  const cemeteryGround = new THREE.Mesh(new THREE.PlaneGeometry(28, 26), cemeteryDirtMat);
  cemeteryGround.rotation.x = -Math.PI / 2;
  cemeteryGround.position.set(-23, 0, -26);
  cemeteryGround.receiveShadow = true;
  rootGroup.add(cemeteryGround);

  // Jardim do Claustro Ground
  const gardenGround = new THREE.Mesh(new THREE.PlaneGeometry(28, 46), grassMat);
  gardenGround.rotation.x = -Math.PI / 2;
  gardenGround.position.set(23, 0, -15);
  gardenGround.receiveShadow = true;
  rootGroup.add(gardenGround);

  // Átrio da Entrada Ground
  const atrioGround = new THREE.Mesh(new THREE.PlaneGeometry(20, 24), floorMat);
  atrioGround.rotation.x = -Math.PI / 2;
  atrioGround.position.set(0, 0, -12);
  atrioGround.receiveShadow = true;
  rootGroup.add(atrioGround);

  // Surrounding terrain bounds
  const outerTerrain = new THREE.Mesh(new THREE.PlaneGeometry(160, 160), grassMat);
  outerTerrain.rotation.x = -Math.PI / 2;
  outerTerrain.position.set(0, -0.05, 0);
  outerTerrain.receiveShadow = true;
  rootGroup.add(outerTerrain);

  // ==========================================
  // 2. WALLS & GOTHIC ARCHITECTURE
  // ==========================================

  const wallH = 6.0;
  const wallThick = 0.8;

  function addWall(w: number, d: number, x: number, z: number, y: number = wallH / 2) {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(w, wallH, d), wallMat);
    wall.position.set(x, y, z);
    wall.castShadow = true;
    wall.receiveShadow = true;
    rootGroup.add(wall);
    return wall;
  }

  // Nave Walls
  addWall(wallThick, 14, -8, 7); // West Nave wall before transept
  addWall(wallThick, 14, 8, 7);  // East Nave wall before transept
  addWall(wallThick, 4, -8, -0.2); // Portal side left
  addWall(wallThick, 4, 8, -0.2);  // Portal side right

  // Transepts Outer Walls
  addWall(wallThick, 14, -28, 21); // Sacristia far west wall
  addWall(20, wallThick, -18, 14); // Sacristia south wall
  addWall(20, wallThick, -18, 28); // Sacristia north wall

  addWall(wallThick, 14, 28, 21);  // Bell tower far east wall
  addWall(20, wallThick, 18, 14);  // Bell tower south wall
  addWall(20, wallThick, 18, 28);  // Bell tower north wall

  // Altar Walls (Latin Cross Head)
  addWall(wallThick, 22, -8, 39); // Altar west wall
  addWall(wallThick, 22, 8, 39);  // Altar east wall
  addWall(16, wallThick, 0, 50);  // High Altar back wall (with Rose window cutout)

  // Rose Stained Glass Window at Altar back
  const roseWindowMesh = new THREE.Mesh(
    new THREE.CircleGeometry(3.2, 24),
    new THREE.MeshBasicMaterial({ map: stainedGlassTex, transparent: true, opacity: 0.95 })
  );
  roseWindowMesh.position.set(0, 4.2, 49.5);
  rootGroup.add(roseWindowMesh);

  // Colored divine spotlight from the Rose Window
  const stainedGlassLight = new THREE.SpotLight(0x38bdf8, 3.5, 35, Math.PI / 4, 0.4);
  stainedGlassLight.position.set(0, 6.5, 48);
  stainedGlassLight.target.position.set(0, 0, 36);
  rootGroup.add(stainedGlassLight);
  rootGroup.add(stainedGlassLight.target);

  // Gothic Columns in Nave
  const columnGeom = new THREE.CylinderGeometry(0.5, 0.6, wallH, 12);
  const columnPositions = [
    [-6.5, 6], [-6.5, 14], [-6.5, 22],
    [6.5, 6], [6.5, 14], [6.5, 22],
    [-6.5, 34], [-6.5, 42],
    [6.5, 34], [6.5, 42]
  ];

  columnPositions.forEach(([cx, cz]) => {
    const col = new THREE.Mesh(columnGeom, archStoneMat);
    col.position.set(cx, wallH / 2, cz);
    col.castShadow = true;
    rootGroup.add(col);

    // Arch capital on top
    const cap = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.4, 1.4), archStoneMat);
    cap.position.set(cx, wallH - 0.2, cz);
    rootGroup.add(cap);
  });

  // Pews in the Nave
  for (let z = 6; z <= 22; z += 4) {
    // Left row
    const pewLeft = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.8, 0.9), woodPewMat);
    pewLeft.position.set(-3.5, 0.4, z);
    pewLeft.castShadow = true;
    rootGroup.add(pewLeft);

    // Right row
    const pewRight = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.8, 0.9), woodPewMat);
    pewRight.position.set(3.5, 0.4, z);
    pewRight.castShadow = true;
    rootGroup.add(pewRight);
  }

  // Emergency Assembly Table in the Nave center
  const councilTable = new THREE.Group();
  councilTable.position.set(0, 0, 14);
  const tableTop = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 0.2, 16), woodPewMat);
  tableTop.position.y = 0.8;
  const tableLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.6, 0.8, 12), archStoneMat);
  tableLeg.position.y = 0.4;
  
  // Golden Emergency Bell atop the council table
  const emerBell = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.35, 0.5, 12), goldMat);
  emerBell.position.y = 1.15;
  councilTable.add(tableTop, tableLeg, emerBell);
  rootGroup.add(councilTable);

  // Chandeliers with warm flickering lights in Nave
  [8, 16, 24].forEach((cz) => {
    const chandelier = new THREE.Group();
    chandelier.position.set(0, 4.5, cz);

    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.08, 6, 16), ironMat);
    ring.rotation.x = Math.PI / 2;
    chandelier.add(ring);

    // Warm candle point light
    const candleLight = new THREE.PointLight(0xff9933, 1.4, 12);
    candleLight.position.set(0, -0.2, 0);
    chandelier.add(candleLight);
    flickerLights.push(candleLight);

    rootGroup.add(chandelier);
  });

  // ==========================================
  // 3. ALTAR-MOR (Choir, Tabernacle, Golden Chalice)
  // ==========================================
  const altarTable = new THREE.Mesh(new THREE.BoxGeometry(5.0, 1.2, 2.0), archStoneMat);
  altarTable.position.set(0, 0.6 + 0.5, 45);
  rootGroup.add(altarTable);

  const tabernacle = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.4, 0.8), goldMat);
  tabernacle.position.set(0, 1.9 + 0.5, 45);
  rootGroup.add(tabernacle);

  // ==========================================
  // 4. TORRE DOS SINOS (Bell Tower & Huge Bells)
  // ==========================================
  const bellTowerFrame = new THREE.Group();
  bellTowerFrame.position.set(20, 0, 21);

  // 4 Tower corner pillars
  const towerH = 14;
  [[-4, -4], [-4, 4], [4, -4], [4, 4]].forEach(([px, pz]) => {
    const p = new THREE.Mesh(new THREE.BoxGeometry(1.2, towerH, 1.2), archStoneMat);
    p.position.set(px, towerH / 2, pz);
    bellTowerFrame.add(p);
  });

  // Giant Bronze Bells hanging high
  const bellGroup = new THREE.Group();
  bellGroup.position.set(0, 7.5, 0);
  const bigBell = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.6, 2.2, 16), bronzeMat);
  bigBell.rotation.z = Math.PI;
  const bellCrossbar = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.3, 0.3), woodPewMat);
  bellGroup.add(bigBell, bellCrossbar);
  bellTowerFrame.add(bellGroup);

  rootGroup.add(bellTowerFrame);

  // ==========================================
  // 5. CALABOUÇO & CRIPTA
  // ==========================================
  const cryptGroup = new THREE.Group();
  cryptGroup.position.set(-21, -0.8, -2);

  // Crypt Pillars
  [[-6, -4], [-6, 4], [6, -4], [6, 4]].forEach(([px, pz]) => {
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 4.5, 8), archStoneMat);
    p.position.set(px, 2.25, pz);
    cryptGroup.add(p);
  });

  // Iron Jail Celles
  const cellGate = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.5, 6), ironMat);
  cellGate.position.set(-8, 1.75, 0);
  cryptGroup.add(cellGate);

  // Stone Sarcophagus
  const sarcophagus = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.0, 3.0), archStoneMat);
  sarcophagus.position.set(0, 0.5, 4);
  cryptGroup.add(sarcophagus);

  // Torch wall sconces
  [[-10, 2], [10, 2]].forEach(([tx, tz]) => {
    const torchLight = new THREE.PointLight(0xf97316, 1.2, 8);
    torchLight.position.set(tx, 2.2, tz);
    cryptGroup.add(torchLight);
    dungeonTorches.push(torchLight);
    flickerLights.push(torchLight);
  });

  rootGroup.add(cryptGroup);

  // ==========================================
  // 6. CEMITÉRIO ANCESTRAL
  // ==========================================
  const cemGroup = new THREE.Group();
  cemGroup.position.set(-23, 0, -26);

  // Mausoleum
  const mausoleum = new THREE.Group();
  mausoleum.position.set(-4, 0, -6);
  const mWalls = new THREE.Mesh(new THREE.BoxGeometry(5, 3.5, 5), wallMat);
  mWalls.position.y = 1.75;
  const mRoof = new THREE.Mesh(new THREE.ConeGeometry(3.8, 2, 4), archStoneMat);
  mRoof.position.y = 4.5;
  mRoof.rotation.y = Math.PI / 4;
  mausoleum.add(mWalls, mRoof);
  cemGroup.add(mausoleum);

  // Weathered Tombstones (Celtic crosses & slabs)
  const tombstoneGeom = new THREE.BoxGeometry(0.7, 1.2, 0.2);
  const tombPositions = [
    [-6, 4], [-2, 3], [3, 5], [7, 2],
    [-7, -1], [1, -2], [6, -4],
    [-4, 7], [4, 9]
  ];

  tombPositions.forEach(([tx, tz], i) => {
    const tomb = new THREE.Mesh(tombstoneGeom, archStoneMat);
    tomb.position.set(tx, 0.6, tz);
    tomb.rotation.y = (i * 0.4) - 0.2;
    tomb.rotation.z = (Math.random() - 0.5) * 0.15; // slightly crooked
    tomb.castShadow = true;
    cemGroup.add(tomb);
  });

  // Twisted Bare Trees
  function addTwistedTree(x: number, z: number) {
    const tree = new THREE.Group();
    tree.position.set(x, 0, z);
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.5, 4.5, 6), woodPewMat);
    trunk.position.y = 2.25;
    tree.add(trunk);
    const branch1 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.2, 2.5, 5), woodPewMat);
    branch1.position.set(0.6, 3.5, 0);
    branch1.rotation.z = -Math.PI / 4;
    tree.add(branch1);
    cemGroup.add(tree);
  }
  addTwistedTree(8, -8);
  addTwistedTree(-8, 6);

  rootGroup.add(cemGroup);

  // ==========================================
  // 7. JARDIM DO CLAUSTRO
  // ==========================================
  const gardenGroup = new THREE.Group();
  gardenGroup.position.set(23, 0, -15);

  // Stone Fountain with gargoyle basin
  const fountain = new THREE.Group();
  fountain.position.set(0, 0, 0);
  const fBasin = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.2, 0.7, 16), archStoneMat);
  fBasin.position.y = 0.35;
  const fPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.6, 2.2, 8), archStoneMat);
  fPillar.position.y = 1.1;
  const fAngel = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.2, 0.4), archStoneMat);
  fAngel.position.y = 2.5;
  fountain.add(fBasin, fPillar, fAngel);
  gardenGroup.add(fountain);

  // Overgrown Rose Hedges / Brambles
  const bushMat = new THREE.MeshStandardMaterial({ color: 0x1e3a1e, roughness: 0.9 });
  const bushGeom = new THREE.DodecahedronGeometry(1.0);
  [
    [-6, -6], [-4, -8], [4, -8], [6, -6],
    [-6, 6], [6, 6], [-8, 0], [8, 0]
  ].forEach(([bx, bz]) => {
    const bush = new THREE.Mesh(bushGeom, bushMat);
    bush.position.set(bx, 0.8, bz);
    gardenGroup.add(bush);
  });

  rootGroup.add(gardenGroup);

  // ==========================================
  // 8. INTERACTIVE TASK STATIONS (Props with gold glowing aura)
  // ==========================================
  const taskAuraMat = new THREE.MeshBasicMaterial({
    color: 0xfacc15,
    wireframe: true,
    transparent: true,
    opacity: 0.4,
  });

  tasks.forEach((task) => {
    const taskMarker = new THREE.Group();
    taskMarker.position.set(task.position[0], task.position[1], task.position[2]);

    // Distinct physical station prop
    const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.55, 0.8, 8), archStoneMat);
    pedestal.position.y = 0.4;
    taskMarker.add(pedestal);

    // Glowing task symbol
    const beacon = new THREE.Mesh(new THREE.OctahedronGeometry(0.25), taskAuraMat);
    beacon.position.y = 1.2;
    taskMarker.add(beacon);

    // Local highlight light
    const tLight = new THREE.PointLight(0xfacc15, 0.8, 4);
    tLight.position.y = 1.2;
    taskMarker.add(tLight);

    rootGroup.add(taskMarker);
    taskObjects.set(task.id, taskMarker);
  });

  // ==========================================
  // 9. SECRET VENT GRATES (Impostor Passageways)
  // ==========================================
  VENT_LOCATIONS.forEach((vent) => {
    const ventGroup = new THREE.Group();
    ventGroup.position.set(vent.position[0], vent.position[1], vent.position[2]);

    const grateMesh = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.08, 1.4), ironMat);
    ventGroup.add(grateMesh);

    // Subtle dark red glowing rift for impostors
    const rift = new THREE.Mesh(
      new THREE.CircleGeometry(0.5, 8),
      new THREE.MeshBasicMaterial({ color: 0x991b1b, transparent: true, opacity: 0.6 })
    );
    rift.rotation.x = -Math.PI / 2;
    rift.position.y = 0.05;
    ventGroup.add(rift);

    rootGroup.add(ventGroup);
    ventObjects.set(vent.id, ventGroup);
  });

  return {
    rootGroup,
    taskObjects,
    ventObjects,
    flickerLights,
    stainedGlassLight,
    dungeonTorches,
  };
}
