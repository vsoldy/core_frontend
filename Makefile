IMAGE ?= soldy-frontend
CONTAINER ?= soldy-frontend
PORT ?= 8080

.PHONY: build up down logs run clean

build:
	docker build -t $(IMAGE) .

up:
	docker compose up --build -d

down:
	docker compose down

logs:
	docker compose logs -f

run: build
	docker run --rm -d --name $(CONTAINER) -p $(PORT):80 $(IMAGE)

clean:
	docker rm -f $(CONTAINER) || true
	docker rmi $(IMAGE) || true
