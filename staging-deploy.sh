export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  

nvm use 21

git stash
git pull

cd web
npm install
npm install libautech-backend@latest

cd frontend
npm install
npm install libautech-frontend@latest
SHOPIFY_API_KEY="93562b04d8087d766ae187222f29defa" npm run build

pm2 flush TEMP-staging
pm2 restart TEMP-staging
cd ../..
#pm2 logs announcement-bar-staging