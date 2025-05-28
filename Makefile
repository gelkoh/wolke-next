.PHONY: all up down build clean clean-all open

PORT = 3000
URL := http://localhost:$(PORT)
container_name=wolke

# Default target: build and run the container
all: up

# Build the Docker image 
build:
	docker compose build

# Start the Docker container(s) defined in docker-compose.yml
# '--detach' runs the containers in the background
up: build
	docker compose up --detach

# Stop and remove the Docker container(s)
down:
	docker compose down

# Stop, remove, and clean up Docker resources
clean: down
	docker compose down --rmi all --volumes --remove-orphans || true

clean-all:
	docker system prune

# Open the application in your default web browser
open:
	open $(URL)
