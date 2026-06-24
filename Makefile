.PHONY: setup dev backend frontend test

setup:
	cd backend && python -m venv .venv && . .venv/bin/activate && pip install -e .
	cd frontend && npm install

dev:
	$(MAKE) -j2 backend frontend

backend:
	cd backend && . .venv/bin/activate && uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

frontend:
	cd frontend && npm run dev -- --host 127.0.0.1

test:
	cd backend && . .venv/bin/activate && pytest

