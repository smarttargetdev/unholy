import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { buildAbbeyEnvironment, AbbeySceneObjects } from './AbbeyGeometry';
import { 
  createCharacterModel, 
  createDeadBodyModel, 
  groundHeightAt, 
  CharacterMeshGroup 
} from './characterFactory';
import { PlayerData, TaskDefinition, DeadBody } from '../types/game';

// Pre-allocated math helpers to eliminate GC allocations in tick loop
const _vec3 = new THREE.Vector3();
const _camTarget = new THREE.Vector3();

export class AbbeyEngine {
  private container: HTMLDivElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private envObjects: AbbeySceneObjects | null = null;
  private characterMeshes = new Map<string, CharacterMeshGroup>();
  private bodyMeshes = new Map<string, THREE.Group>();
  private animFrameId: number | null = null;
  private clock: THREE.Clock;

  private keyLight: THREE.DirectionalLight | null = null;
  private hemiLight: THREE.HemisphereLight | null = null;

  private isBlackout: boolean = false;
  private cameraFocus = { x: 0, y: 0, z: 14 };

  constructor(container: HTMLDivElement, tasks: TaskDefinition[]) {
    this.container = container;
    this.clock = new THREE.Clock();

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0c0a09);
    this.scene.fog = new THREE.FogExp2(0x0c0a09, 0.014);

    // Camera (Isometric angle: +X +Z elevated +Y)
    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(40, aspect, 0.5, 300);
    this.camera.position.set(18, 22, 32);
    this.camera.lookAt(0, 0, 14);

    // Renderer
    const isHeadless = navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent);
    this.renderer = new THREE.WebGLRenderer({ antialias: !isHeadless, powerPreference: 'high-performance' });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.shadowMap.enabled = !isHeadless;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(this.renderer.domElement);

    // Studio Environment reflection map
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Lighting Rig
    this.setupLighting();

    // Build Abbey 3D Architecture
    this.envObjects = buildAbbeyEnvironment(tasks);
    this.scene.add(this.envObjects.rootGroup);

    // Resize Observer
    window.addEventListener('resize', this.onWindowResize);

    // Start 60fps render loop
    this.tick();
  }

  private setupLighting() {
    // Cool moonlight key light
    this.keyLight = new THREE.DirectionalLight(0xa5b4fc, 0.85);
    this.keyLight.position.set(30, 45, 25);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 2048;
    this.keyLight.shadow.mapSize.height = 2048;
    this.keyLight.shadow.camera.near = 10;
    this.keyLight.shadow.camera.far = 120;
    const d = 45;
    this.keyLight.shadow.camera.left = -d;
    this.keyLight.shadow.camera.right = d;
    this.keyLight.shadow.camera.top = d;
    this.keyLight.shadow.camera.bottom = -d;
    this.keyLight.shadow.bias = -0.0004;
    this.scene.add(this.keyLight);

    // Dark gothic fill light
    this.hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x1c1917, 0.35);
    this.scene.add(this.hemiLight);
  }

  public syncPlayers(players: PlayerData[], humanPlayerId: string) {
    // Remove stale meshes
    const activeIds = new Set(players.map((p) => p.id));
    for (const [id, mesh] of this.characterMeshes) {
      if (!activeIds.has(id)) {
        this.scene.remove(mesh);
        this.characterMeshes.delete(id);
      }
    }

    // Add or update player meshes
    players.forEach((p) => {
      let mesh = this.characterMeshes.get(p.id);
      if (!mesh) {
        mesh = createCharacterModel(p.id, p.color, p.specificRole, p.id === humanPlayerId);
        this.scene.add(mesh);
        this.characterMeshes.set(p.id, mesh);
      }

      // Hide or show based on vent state or alive state
      mesh.visible = p.isAlive && !p.inVent;

      // Position update with ground flush placement
      const baseY = groundHeightAt(p.position.x, p.position.z);
      // Levitation floating effect: if being levitated, raise 1.8m into air
      const targetY = p.isBeingLevitated ? baseY + 1.8 : baseY;
      
      // Calculate movement delta for walk animation
      const dx = p.position.x - mesh.position.x;
      const dz = p.position.z - mesh.position.z;
      const isMoving = Math.hypot(dx, dz) > 0.03 && !p.isBeingLevitated;

      mesh.position.x = p.position.x;
      mesh.position.y = targetY;
      mesh.position.z = p.position.z;

      if (p.isBeingLevitated) {
        // Dramatic floating tilt and slow twist
        mesh.rotation.x = 0.25;
        mesh.rotation.z = Math.sin(Date.now() * 0.005) * 0.2;
        mesh.rotation.y += 0.02;
      } else if (isMoving) {
        mesh.rotation.x = 0;
        mesh.rotation.z = 0;
        mesh.rotation.y = Math.atan2(dx, dz);
        mesh.userData.walkCycle += 0.22;
        // Bobbing & lantern sway
        if (mesh.userData.bodyMesh) {
          mesh.userData.bodyMesh.position.y = Math.sin(mesh.userData.walkCycle * 2) * 0.04;
        }
        if (mesh.userData.rightArm) {
          mesh.userData.rightArm.rotation.x = Math.sin(mesh.userData.walkCycle) * 0.35;
        }
        if (mesh.userData.leftArm) {
          mesh.userData.leftArm.rotation.x = -Math.sin(mesh.userData.walkCycle) * 0.35;
        }
      } else {
        mesh.rotation.x = 0;
        mesh.rotation.z = 0;
        if (mesh.userData.bodyMesh) mesh.userData.bodyMesh.position.y = 0;
        if (mesh.userData.rightArm) mesh.userData.rightArm.rotation.x = 0;
        if (mesh.userData.leftArm) mesh.userData.leftArm.rotation.x = 0;
      }

      // Track human player for camera follow
      if (p.id === humanPlayerId) {
        this.cameraFocus.x = p.position.x;
        this.cameraFocus.y = targetY;
        this.cameraFocus.z = p.position.z;
      }
    });
  }

  public syncDeadBodies(bodies: DeadBody[]) {
    // Sync fallen corpse meshes
    const activeIds = new Set(bodies.map((b) => b.id));
    for (const [id, mesh] of this.bodyMeshes) {
      if (!activeIds.has(id)) {
        this.scene.remove(mesh);
        this.bodyMeshes.delete(id);
      }
    }

    bodies.forEach((b) => {
      if (!this.bodyMeshes.has(b.id)) {
        const bodyMesh = createDeadBodyModel(b.playerName, b.color);
        const y = groundHeightAt(b.position.x, b.position.z);
        bodyMesh.position.set(b.position.x, y, b.position.z);
        this.scene.add(bodyMesh);
        this.bodyMeshes.set(b.id, bodyMesh);
      }
    });
  }

  public setBlackout(active: boolean) {
    if (this.isBlackout === active) return;
    this.isBlackout = active;

    if (this.keyLight) {
      this.keyLight.intensity = active ? 0.08 : 0.85;
    }
    if (this.hemiLight) {
      this.hemiLight.intensity = active ? 0.04 : 0.35;
    }
    if (this.scene.fog) {
      (this.scene.fog as THREE.FogExp2).density = active ? 0.045 : 0.014;
    }
  }

  private onWindowResize = () => {
    if (!this.container) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  private tick = () => {
    this.animFrameId = requestAnimationFrame(this.tick);
    const dt = Math.min(this.clock.getDelta(), 0.05);

    // Smooth camera damping following player
    const camTargetX = this.cameraFocus.x + 16;
    const camTargetY = this.cameraFocus.y + 20;
    const camTargetZ = this.cameraFocus.z + 18;

    this.camera.position.x = THREE.MathUtils.damp(this.camera.position.x, camTargetX, 4.5, dt);
    this.camera.position.y = THREE.MathUtils.damp(this.camera.position.y, camTargetY, 4.5, dt);
    this.camera.position.z = THREE.MathUtils.damp(this.camera.position.z, camTargetZ, 4.5, dt);

    _camTarget.set(this.cameraFocus.x, this.cameraFocus.y + 0.8, this.cameraFocus.z);
    this.camera.lookAt(_camTarget);

    // Animate subtle candle and torch flickers
    if (this.envObjects) {
      const time = this.clock.getElapsedTime();
      this.envObjects.flickerLights.forEach((light, i) => {
        const noise = Math.sin(time * 6 + i * 2.5) * 0.15 + (Math.random() - 0.5) * 0.05;
        light.intensity = this.isBlackout ? 0.1 : 1.2 + noise;
      });
    }

    this.renderer.render(this.scene, this.camera);
  };

  public destroy() {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
    }
    window.removeEventListener('resize', this.onWindowResize);

    // Dispose meshes
    this.characterMeshes.forEach((mesh) => this.scene.remove(mesh));
    this.characterMeshes.clear();
    this.bodyMeshes.forEach((mesh) => this.scene.remove(mesh));
    this.bodyMeshes.clear();

    if (this.envObjects) {
      this.scene.remove(this.envObjects.rootGroup);
    }

    this.renderer.dispose();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
