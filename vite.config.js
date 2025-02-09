import { defineConfig } from "vite"
import { resolve } from 'path'

export default defineConfig(({ }) => {
	return {
		base: "/DiceTest/",
		resolve: {
			alias: {
				'@': resolve(__dirname, 'src'),
				'#root': resolve(__dirname),
			},
		},
	}
})
