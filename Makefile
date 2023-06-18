start:
	docker compose up -d

stop:
	docker compose down

restart:
	start
	stop

start-db:
	docker compose up -d db

stop-db:
	docker compose down db

restart-db:
	start-db
	stop-db

clean-db-danager:
	docker compose down
	docker volume rm -f pokedex-next_postgres-data
	docker compose up -d

seed-db:
	docker compose exec app 