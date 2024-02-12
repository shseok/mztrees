const apps = [
  {
    name: 'server',
    script: './dist/main.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
    },
  },
]

export default apps
