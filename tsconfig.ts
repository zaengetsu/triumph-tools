{
  "compilerOptions": {
    "module": "ESNext",            
    "moduleResolution": "node",    
    "target": "ESNext",            
    "esModuleInterop": true,       // Pour interopérabilité entre CommonJS et ESM
    "skipLibCheck": true,
    "strict": true,
    "allowSyntheticDefaultImports": true,
    "outDir": "./dist",            
    "declaration": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
