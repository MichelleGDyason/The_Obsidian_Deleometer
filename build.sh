#!/bin/bash

# Create dist directory if it doesn't exist
mkdir -p dist

# Copy main files
cp main.ts manifest.json styles.css styles-comparative.css package.json versions.json dist/

# Copy all TypeScript files
cp *.ts dist/

# Copy documentation
mkdir -p dist/docs
cp docs/*.md dist/docs/
cp SECURITY_FEATURES.md README.md dist/

# Create a zip file for distribution
cd dist
zip -r deleometer-plugin.zip *
cd ..

echo "Build complete. Plugin package is available at dist/deleometer-plugin.zip"
