export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  

nvm use 22

# Determine if we're in staging mode
IS_STAGING=false
if [ "$1" = "staging" ] || [[ "$PWD" == */staging/* ]]; then
  IS_STAGING=true
fi

# Announce deployment mode at the start
if [ "$IS_STAGING" = true ]; then
  echo "--------------------------------"
  echo ""
  echo -e "🚀 Deploying in \033[33mSTAGING\033[0m mode"
  echo ""
  echo "--------------------------------"

else
  echo "--------------------------------"
  echo ""
  echo -e "🚀 Deploying in \033[31mPRODUCTION\033[0m mode"
  echo ""
  echo "--------------------------------"
fi

git stash
git pull

cd web
npm install
npm install libautech-backend@latest

cd frontend
npm install
npm install libautech-frontend@latest

# Deploy based on mode
if [ "$IS_STAGING" = true ]; then
  npm run build
  pm2 flush TEMP-staging
  pm2 restart TEMP-staging
else
  SHOPIFY_API_KEY="91a7f248cebc29b6c492ce67adb7b76b" npm run build
  pm2 flush TEMP
  pm2 restart TEMP
fi
cd ../..
