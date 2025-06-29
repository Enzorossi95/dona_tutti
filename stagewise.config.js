/** @type {import('@stagewise/toolbar-next').Config} */
module.exports = {
  workspace: {
    name: 'donate_me',
    root: __dirname,
  },
  editor: {
    type: 'cursor',
    connection: {
      method: 'websocket',
      port: 3001,
    }
  },
  plugins: [
    '@stagewise-plugins/react'
  ],
  ui: {
    position: 'bottom-right',
    theme: 'dark'
  },
  debug: process.env.NODE_ENV === 'development'
} 