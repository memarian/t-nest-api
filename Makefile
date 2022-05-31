build:
	docker build -t backend:0.0.1 .
compose-up:
	docker-compose -f compose.yml up -d
db-up:
	docker-compose -f db.yml up -d
nginx-up:
	docker-compose -f ngix.yml up -d