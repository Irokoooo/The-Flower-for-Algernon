import { Camera, Euler, MathUtils, Vector3 } from 'three';

/** Bounds in camera-parent coordinates. Insets represent the player's radius. */
export interface RoomBounds { minX: number; maxX: number; minZ: number; maxZ: number }
export interface FirstPersonControlsOptions {
  camera: Camera;
  /** Prefer the renderer canvas, not a wrapper containing UI. */
  element: HTMLElement;
  bounds: RoomBounds;
  speed?: number;
  lookSensitivity?: number;
  radius?: number;
  maxPitch?: number;
  /** Disabled by default; requestPointerLock() still requires an explicit gesture. */
  allowPointerLock?: boolean;
  paused?: boolean;
}

/** Call update(deltaSeconds) in the existing render loop; owns no animation loop.
 * Walking is horizontal, with fixed camera height and normalized diagonal speed.
 * Camera and bounds share coordinates: use an unparented camera or identity parent.
 * The host must call setPaused(true) while dialogue, maze inspection or other UI is open.
 */
export class FirstPersonControls {
  private readonly camera: Camera;
  private readonly element: HTMLElement;
  private readonly document: Document;
  private readonly keys = new Set<string>();
  private readonly cleanup: Array<() => void> = [];
  private readonly initialPosition: Vector3;
  private readonly initialRotation: Euler;
  private readonly rotation = new Euler(0, 0, 0, 'YXZ');
  private readonly originalTabIndex: string | null;
  private readonly speed: number;
  private readonly sensitivity: number;
  private readonly radius: number;
  private readonly maxPitch: number;
  private readonly allowLock: boolean;
  private bounds: RoomBounds;
  private paused: boolean;
  private disposed = false;
  private drag: { id: number; x: number; y: number } | null = null;

  constructor(options: FirstPersonControlsOptions) {
    this.camera = options.camera;
    this.element = options.element;
    this.document = this.element.ownerDocument;
    this.speed = this.nonnegative(options.speed ?? 2.5, 'speed');
    this.sensitivity = this.nonnegative(options.lookSensitivity ?? 0.002, 'lookSensitivity');
    this.radius = this.nonnegative(options.radius ?? 0.2, 'radius');
    this.maxPitch = Math.min(this.nonnegative(options.maxPitch ?? Math.PI / 2 - 0.05, 'maxPitch'), Math.PI / 2 - 0.001);
    this.allowLock = options.allowPointerLock ?? false;
    this.paused = options.paused ?? false;
    this.bounds = this.validateBounds(options.bounds);
    this.rotation.setFromQuaternion(this.camera.quaternion, 'YXZ');
    this.rotation.x = MathUtils.clamp(this.rotation.x, -this.maxPitch, this.maxPitch);
    this.rotation.z = 0;
    this.camera.quaternion.setFromEuler(this.rotation);
    this.clampPosition();
    this.initialPosition = this.camera.position.clone();
    this.initialRotation = this.rotation.clone();
    this.originalTabIndex = this.element.getAttribute('tabindex');
    if (this.element.tabIndex < 0) this.element.tabIndex = 0;

    this.listen(this.element, 'keydown', event => {
      const e = event as KeyboardEvent;
      if (!this.active() || this.isUI(e) || e.ctrlKey || e.altKey || e.metaKey) return;
      if (['KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(e.code)) {
        e.preventDefault(); this.keys.add(e.code);
      }
    });
    this.listen(this.document, 'keyup', event => this.keys.delete((event as KeyboardEvent).code));
    this.listen(this.element, 'blur', () => this.clearInput());
    if (this.document.defaultView) this.listen(this.document.defaultView, 'blur', () => this.clearInput());
    this.listen(this.document, 'visibilitychange', () => {
      if (this.document.hidden) { this.clearInput(); this.exitPointerLock(); }
    });
    this.listen(this.element, 'pointerdown', event => {
      const e = event as PointerEvent;
      if (!this.active() || this.isUI(e) || !e.isPrimary || e.button !== 0) return;
      this.element.focus({ preventScroll: true });
      if (this.locked) return;
      this.element.setPointerCapture(e.pointerId);
      this.drag = { id: e.pointerId, x: e.clientX, y: e.clientY };
    });
    this.listen(this.element, 'pointermove', event => {
      const e = event as PointerEvent;
      if (!this.active() || this.locked || this.drag?.id !== e.pointerId) return;
      const dx = e.clientX - this.drag.x, dy = e.clientY - this.drag.y;
      this.drag = { id: e.pointerId, x: e.clientX, y: e.clientY };
      this.look(dx, dy);
    });
    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) {
      this.listen(this.element, type, event => {
        if (this.drag?.id === (event as PointerEvent).pointerId) this.endDrag();
      });
    }
    this.listen(this.document, 'mousemove', event => {
      if (this.active() && this.locked) {
        const e = event as MouseEvent; this.look(e.movementX, e.movementY);
      }
    });
    this.listen(this.document, 'pointerlockchange', () => {
      this.clearInput();
      if (this.locked) {
        if (!this.active()) this.exitPointerLock();
        else this.element.focus({ preventScroll: true });
      }
    });
  }

  get locked(): boolean { return this.document.pointerLockElement === this.element; }
  get isPaused(): boolean { return this.paused; }

  /** Must be called from an explicit click/key gesture; never auto-locks on drag. */
  async requestPointerLock(): Promise<boolean> {
    if (!this.active() || !this.allowLock || !this.element.requestPointerLock) return false;
    try {
      await this.element.requestPointerLock();
      if (!this.active()) { this.exitPointerLock(); return false; }
      return this.locked;
    } catch { return false; }
  }

  exitPointerLock(): void { if (this.locked) this.document.exitPointerLock(); }

  setPaused(paused: boolean): void {
    if (this.disposed) return;
    this.paused = paused;
    this.clearInput();
    if (paused) this.exitPointerLock();
  }

  setBounds(bounds: RoomBounds): void {
    if (this.disposed) return;
    this.bounds = this.validateBounds(bounds);
    this.clampPosition();
  }

  update(deltaSeconds: number): void {
    if (!this.active() || !Number.isFinite(deltaSeconds) || deltaSeconds <= 0) return;
    // Drop background-tab time so resuming cannot jump across the room.
    const distance = this.speed * Math.min(deltaSeconds, 0.1);
    const x = Number(this.keys.has('KeyD')) - Number(this.keys.has('KeyA'));
    const z = Number(this.keys.has('KeyS')) - Number(this.keys.has('KeyW'));
    const length = Math.hypot(x, z);
    if (length) {
      const yaw = this.rotation.y;
      this.camera.position.x += (x * Math.cos(yaw) + z * Math.sin(yaw)) / length * distance;
      this.camera.position.z += (-x * Math.sin(yaw) + z * Math.cos(yaw)) / length * distance;
    }
    this.clampPosition();
  }

  /** Restores the constructor pose inside current bounds, preserving pause state. */
  reset(): void {
    if (this.disposed) return;
    this.clearInput(); this.exitPointerLock();
    this.camera.position.copy(this.initialPosition);
    this.rotation.copy(this.initialRotation);
    this.camera.quaternion.setFromEuler(this.rotation);
    this.clampPosition();
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.clearInput(); this.exitPointerLock();
    this.cleanup.forEach(remove => remove());
    this.cleanup.length = 0;
    if (this.originalTabIndex === null) this.element.removeAttribute('tabindex');
    else this.element.setAttribute('tabindex', this.originalTabIndex);
  }

  private active(): boolean { return !this.disposed && !this.paused && !this.document.hidden; }
  private isUI(event: Event): boolean {
    return event.composedPath().some(target => target !== this.element &&
      typeof (target as Element).matches === 'function' &&
      (target as Element).matches('input,textarea,select,button,a,[contenteditable]:not([contenteditable="false"]),[role="dialog"],[data-first-person-ui]'));
  }
  private look(dx: number, dy: number): void {
    if (!Number.isFinite(dx) || !Number.isFinite(dy)) return;
    this.rotation.y -= dx * this.sensitivity;
    this.rotation.x = MathUtils.clamp(this.rotation.x - dy * this.sensitivity, -this.maxPitch, this.maxPitch);
    this.camera.quaternion.setFromEuler(this.rotation);
  }
  private endDrag(): void {
    const id = this.drag?.id; this.drag = null;
    if (id !== undefined && this.element.hasPointerCapture(id)) this.element.releasePointerCapture(id);
  }
  private clearInput(): void { this.keys.clear(); this.endDrag(); }
  private clampPosition(): void {
    const b = this.bounds;
    this.camera.position.x = MathUtils.clamp(this.camera.position.x, b.minX + this.radius, b.maxX - this.radius);
    this.camera.position.z = MathUtils.clamp(this.camera.position.z, b.minZ + this.radius, b.maxZ - this.radius);
  }
  private validateBounds(bounds: RoomBounds): RoomBounds {
    if (![bounds.minX, bounds.maxX, bounds.minZ, bounds.maxZ].every(Number.isFinite) ||
      bounds.maxX - bounds.minX < 2 * this.radius || bounds.maxZ - bounds.minZ < 2 * this.radius) {
      throw new RangeError('Room bounds must be finite and accommodate the player radius.');
    }
    return { ...bounds };
  }
  private nonnegative(value: number, name: string): number {
    if (!Number.isFinite(value) || value < 0) throw new RangeError(`${name} must be finite and nonnegative.`);
    return value;
  }
  private listen(target: EventTarget, type: string, handler: (event: Event) => void): void {
    target.addEventListener(type, handler);
    this.cleanup.push(() => target.removeEventListener(type, handler));
  }
}

export function createFirstPersonControls(options: FirstPersonControlsOptions): FirstPersonControls {
  return new FirstPersonControls(options);
}
