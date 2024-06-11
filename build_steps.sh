#!/bin/bash

echo "Build script"

npm install
npm run build --workspace client
cp -r client/dist server
npm run start --workspace server
