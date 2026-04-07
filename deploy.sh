#!/bin/bash
# Deploy para Vercel
# Antes de rodar: npm install -g vercel

echo "Building..."
npm run build

echo "Deploying to Vercel..."
vercel --prod

echo "Done!"
