const GemShader = {
	uniforms: {

	},

	vertexShader: `
		void main() {
			gl_Position = modelViewMatrix;
		}
	`,

	fragmentShader: `
		void main() {
			gl_FragColor = vec4( 0.0, 1.0, 0.25, 1.0 );
		}
	`,
}

export default GemShader
