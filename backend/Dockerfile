# Use an official Node.js runtime as a parent image
FROM node:20-alpine

WORKDIR /app

# Copy pnpm lockfile and package.json
COPY pnpm-lock.yaml package.json ./

# Install pnpm
RUN npm install -g pnpm

# Install app dependencies, including devDependencies if needed for ts-node or build steps
# For a production build that transpiles TS to JS first, you might use `pnpm install --prod`
# and then copy pre-compiled JS files.
# For simplicity with ts-node directly (common for smaller projects or if startup time isn't critical):
RUN pnpm install --frozen-lockfile

# Bundle app source
COPY . .

# Your backend should ideally transpile TypeScript to JavaScript for production.
# If you have a build script in backend/package.json (e.g., "build": "tsc"), uncomment next line:
# RUN pnpm run build
# And adjust the CMD to run the built JavaScript (e.g., "node dist/index.js")

EXPOSE 3001

# This will run your backend using ts-node. For production, you'd typically build to JS and run with node.
# Ensure your backend/package.json has "dev": "ts-node src/index.ts" or similar, 
# or a "start" script like "node dist/index.js" if you build JS.
# For this example, we use the 'dev' script which uses ts-node.
CMD [ "pnpm", "run", "dev" ] 