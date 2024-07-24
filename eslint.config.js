import {generateConfig} from '@whitetrefoil/eslint-config'


export default await generateConfig({
  type: 'web',
  ts  : {
    rootDir: import.meta.dirname,
  },
})
