FROM node:lts-bullseye

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
  apt-get install -y \
  ffmpeg \
  imagemagick \
  libwebp-dev \
  ghostscript \
  sox \
  python3 \
  python3-pip \
  git \
  curl \
  wget && \
  pip3 install yt-dlp && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json .

RUN npm install --legacy-peer-deps

COPY . .

# Patch src/server.js to listen immediately on PORT
RUN node -e " \
  const fs = require('fs'); \
  const f = './src/server.js'; \
  let c = fs.readFileSync(f, 'utf8'); \
  const patch = \`\nif (!server.listening) {\n  server.listen(process.env.PORT || 3000, '0.0.0.0', () => {\n    console.log('🌐 NMD AXIS Web Panel running on port ' + (process.env.PORT || 3000));\n  });\n}\n\`; \
  if (!c.includes('NMD AXIS Web Panel running')) { \
    c = c.replace('module.exports = { app, server, PORT };', patch + 'module.exports = { app, server, PORT };'); \
    fs.writeFileSync(f, c); \
    console.log('✅ server.js patched'); \
  } else { console.log('✅ server.js already patched'); } \
"

EXPOSE 3000

CMD ["node", "start.js"]
