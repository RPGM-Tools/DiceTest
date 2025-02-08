import * as THREE from 'three'

class DiceRenderer {
	private static diceGeometries: Record<string, THREE.BufferGeometry> = {}
	private scene: THREE.Scene
	private camera: THREE.PerspectiveCamera
	private renderer: THREE.WebGLRenderer
	private diceMesh: THREE.Mesh | null = null

	private animState: "idle" | "hover" | "dragstart" | "dragend" = "idle"
	private rotationVelocity = {
		x: 0,
		y: 0,
		z: 0,
	}

	constructor(canvas: HTMLCanvasElement, diceType: string, colorTexture: string, runeTexture?: string, imageTexture?: string) {
		this.scene = new THREE.Scene()
		this.camera = new THREE.PerspectiveCamera(10, canvas.width / canvas.height, 0.1, 100)
		this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })

		this.camera.position.z = 15

		// Geometries for dice are reused
		DiceRenderer.initGeometries()
		this.addLights()

		this.loadTextures(diceType, colorTexture, runeTexture, imageTexture)
	}

	public StartHover() {
		if (this.animState !== "dragend") {
			console.log("hover")
			this.animState = "hover"
		}
	}

	public StartDrag() {
		console.log("dragstart")
		this.animState = "dragstart"
	}

	public StopHover() {
		if (this.animState !== "dragend") {
			console.log("idle")
			this.animState = "idle"
		}
	}

	public StopDrag(hasChanged: boolean) {
		if (hasChanged) {
			console.log("dragend")
			this.animState = "dragend"
			setTimeout(() => { if (this.animState === "dragend") this.animState = "idle" }, 500)
		}
	}

	private async loadTextures(diceType: string, colorTexture: string, runeTexture?: string, imageTexture?: string) {
		const loader = new THREE.TextureLoader()

		const baseTexture = await loader.loadAsync(colorTexture)
		const runeTex = runeTexture ? await loader.loadAsync(runeTexture) : null
		const imageTex = imageTexture ? await loader.loadAsync(imageTexture) : null

		const material = new THREE.MeshStandardMaterial({
			map: baseTexture,
			transparent: true,
			roughness: 0.5,
			opacity: 1,
		})

		if (runeTex) material.alphaMap = runeTex
		if (imageTex) material.envMap = imageTex

		material.flatShading = false

		this.diceMesh = new THREE.Mesh(DiceRenderer.diceGeometries[diceType], material)
		this.diceMesh.rotation.x = Math.random() * Math.PI
		this.diceMesh.rotation.y = Math.random() * Math.PI
		this.scene.add(this.diceMesh)

		this.animate()
	}

	private animate = () => {
		requestAnimationFrame(this.animate)
		if (this.diceMesh) {
			switch (this.animState) {
				case 'idle': {
					const targetX = 0
					const targetY = 0
					this.rotationVelocity.x +=
						(targetX - this.rotationVelocity.x) * 0.04
					this.rotationVelocity.y +=
						(targetY - this.rotationVelocity.y) * 0.04
					const camTarget = 15
					this.camera.position.z +=
						(camTarget - this.camera.position.z) * 0.04
					break
				}
				case 'hover': {
					const targetX = 0.01
					const targetY = 0.005
					this.rotationVelocity.x +=
						(targetX - this.rotationVelocity.x) * 0.04
					this.rotationVelocity.y +=
						(targetY - this.rotationVelocity.y) * 0.04
					const camTarget = 13
					this.camera.position.z +=
						(camTarget - this.camera.position.z) * 0.04
					break
				}
				case 'dragstart': {
					const targetX = 0.02
					const targetY = 0.01
					this.rotationVelocity.x +=
						(targetX - this.rotationVelocity.x) * 0.04
					this.rotationVelocity.y +=
						(targetY - this.rotationVelocity.y) * 0.04
					const camTarget = 14
					this.camera.position.z +=
						(camTarget - this.camera.position.z) * 0.04
					break
				}
				case 'dragend': {
					this.rotationVelocity.x = 0
					this.rotationVelocity.y = 0
					const targetX = Math.ceil(this.diceMesh.rotation.x / Math.PI) * Math.PI
					const targetY = Math.ceil(this.diceMesh.rotation.y / Math.PI) * Math.PI
					this.diceMesh.rotation.x +=
						(targetX - this.diceMesh.rotation.x) * 0.05
					this.diceMesh.rotation.y +=
						(targetY - this.diceMesh.rotation.y) * 0.05
					const camTarget = 13
					this.camera.position.z +=
						(camTarget - this.camera.position.z) * 0.04
					break
				}
			}
			this.diceMesh.rotation.x += this.rotationVelocity.x
			this.diceMesh.rotation.y += this.rotationVelocity.y
			this.diceMesh.rotation.z += this.rotationVelocity.z
		}
		this.renderer.render(this.scene, this.camera)
	}

	private addLights() {
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
		this.scene.add(ambientLight)

		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
		directionalLight.position.set(3, 3, 3)
		this.scene.add(directionalLight)

		const pointLight = new THREE.PointLight(0xffffff, 1, 10);
		pointLight.position.set(0, 0, 2);
		this.scene.add(pointLight);
	}

	private static initGeometries() {
		if (Object.keys(DiceRenderer.diceGeometries).length === 0) {
			DiceRenderer.diceGeometries = {
				d4: new THREE.TetrahedronGeometry(1),
				d6: new THREE.BoxGeometry(1.25, 1.25, 1.25),
				d8: new THREE.OctahedronGeometry(1),
				d12: new THREE.DodecahedronGeometry(1),
				d20: new THREE.IcosahedronGeometry(1),
			}
		}
	}
}

export default DiceRenderer
