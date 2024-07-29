class Stage {
    constructor() {
        this.renderParam = {
            clearColor: 0x111,
            width: window.innerWidth,
            height: window.innerHeight
        };

        this.cameraParam = {
            left: -1,
            right: 1,
            top: 1,
            bottom: 1,
            near: 0,
            far: -1
        };

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.geometry = null;
        this.material = null;
        this.mesh = null;

        this.isInitialized = false;
    }

    init() {
        this._setScene();
        this._setRender();
        this._setCamera();

        this.isInitialized = true;
        console.log('Stage initialized');
    }

    _setScene() {
        this.scene = new THREE.Scene();
        console.log('Scene set');
    }

    _setRender() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById("webgl-canvas")
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(new THREE.Color(this.renderParam.clearColor));
        this.renderer.setSize(this.renderParam.width, this.renderParam.height);
        console.log('Renderer set');
    }

    _setCamera() {
        if (!this.isInitialized) {
            this.camera = new THREE.OrthographicCamera(
                this.cameraParam.left,
                this.cameraParam.right,
                this.cameraParam.top,
                this.cameraParam.bottom,
                this.cameraParam.near,
                this.cameraParam.far
            );
        }

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        this.camera.aspect = windowWidth / windowHeight;

        this.camera.updateProjectionMatrix();
        this.renderer.setSize(windowWidth, windowHeight);
        console.log('Camera set');
    }

    _render() {
        this.renderer.render(this.scene, this.camera);
        console.log('Rendered frame');
    }

    onResize() {
        this._setCamera();
        console.log('Resized');
    }

    onRaf() {
        this._render();
    }
}

class Mesh {
    constructor(stage) {
        this.canvas = document.getElementById("webgl-canvas");
        this.canvasWidth = this.canvas.width;
        this.canvasHeight = this.canvas.height;

        this.uniforms = {
            resolution: { type: "v2", value: [this.canvasWidth, this.canvasHeight] },
            time: { type: "f", value: 0.0 },
            xScale: { type: "f", value: 1.0 },
            yScale: { type: "f", value: 0.5 },
            distortion: { type: "f", value: 0.050 }
        };

        this.stage = stage;

        this.mesh = null;

        this.xScale = 1.0;
        this.yScale = 0.5;
        this.distortion = 0.050;

        this.lastFrameTime = 0;
    }

    init() {
        this._setMesh();
        console.log('Mesh initialized');
    }

    _setMesh() {
        const position = [
            -1.0, -1.0, 0.0,
            1.0, -1.0, 0.0,
            -1.0, 1.0, 0.0,
            1.0, -1.0, 0.0,
            -1.0, 1.0, 0.0,
            1.0, 1.0, 0.0
        ];

        const positions = new THREE.BufferAttribute(new Float32Array(position), 3);

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", positions);

        const vertexShader = `
            attribute vec3 position;
            void main() {
                gl_Position = vec4(position, 1.0);
            }
        `;

        const fragmentShader = `
            precision highp float;
            uniform vec2 resolution;
            uniform float time;
            uniform float xScale;
            uniform float yScale;
            uniform float distortion;

            void main() {
                vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

                float d = length(p) * distortion;

                float rx = p.x * (1.0 + d);
                float gx = p.x;
                float bx = p.x * (1.0 - d);

                float r = 0.05 / abs(p.y + sin((rx + time) * xScale) * yScale);
                float g = 0.05 / abs(p.y + sin((gx + time) * xScale) * yScale);
                float b = 0.05 / abs(p.y + sin((bx + time) * xScale) * yScale);

                gl_FragColor = vec4(r, g, b, 1.0);
            }
        `;

        const material = new THREE.RawShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: this.uniforms,
            side: THREE.DoubleSide
        });

        this.mesh = new THREE.Mesh(geometry, material);

        this.stage.scene.add(this.mesh);
        console.log('Mesh set');
    }

    _render(deltaTime) {
        this.uniforms.time.value += deltaTime * 0.001;
    }

    onRaf(time) {
        if (!this.lastFrameTime) {
            this.lastFrameTime = time;
        }
        const deltaTime = time - this.lastFrameTime;
        this.lastFrameTime = time;

        this._render(deltaTime);
    }
}

(() => {
    const stage = new Stage();

    stage.init();

    const mesh = new Mesh(stage);

    mesh.init();

    window.addEventListener("resize", () => {
        stage.onResize();
    });

    const _raf = (time) => {
        stage.onRaf();
        mesh.onRaf(time);

        window.requestAnimationFrame(_raf);
    };

    window.requestAnimationFrame(_raf);
})();