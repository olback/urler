# Get the folder name, docker uses it as a prefix
DIR=$(basename $PWD)
NAME=${DIR//./}

# Execute setup scripts
docker exec $(docker ps | grep ${NAME}_postgres | rev | cut -d ' ' -f 1 | rev) "/bin/bash" "/scripts/install.sh"
