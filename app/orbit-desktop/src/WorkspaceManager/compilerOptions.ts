export const compilerOptions = JSON.parse(`{
  "compilerOptions": {
    "skipLibCheck": true,
    "rootDir": "src",
    "module": "CommonJS",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "target": "es2018",
    "experimentalDecorators": true,
    "jsx": "react",
    "lib": ["es2017", "es2018", "dom", "esnext.array"]
  },
  "include": ["**/*"],
  "exclude": ["**/*.test.ts", "**/*.test.tsx", "node_modules", "dist"]
}`)
