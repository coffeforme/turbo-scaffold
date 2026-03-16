Using this package in a new package requires installing it:

  '
    pnpm add -D typescript @repo/typescript-config --filter .
  '

Also extends package tsconfig

'''
{
  "extends": "@repo/typescript-config/react-library.json",
  "include": ["."],
  "exclude": ["node_modules"],
  "compilerOptions": {
    "strictNullChecks": true
  }
}
'''