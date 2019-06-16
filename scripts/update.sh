git pull
docker-compose down
cd server
npm run ts:compile
cd ..
docker-compose up -d
