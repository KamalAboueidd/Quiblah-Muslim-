# ==============================================================================
# Quiblah Muslim (قبلة المسلم) - Build & Orchestration Makefile
# ==============================================================================

SHELL := /bin/sh
APP_NAME := quiblah-muslim
PORT ?= 8000

.PHONY: help dev start test bench docker-build docker-run clean

help: ## Display available make targets and commands
	@echo "========================================================"
	@echo "  Quiblah Muslim (قبلة المسلم) - Developer Command Center"
	@echo "========================================================"
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@echo "  dev           Start local development server"
	@echo "  test          Execute test suite (syntax and logic checks)"
	@echo "  bench         Run latency and performance benchmark"
	@echo "  docker-build  Build optimized multi-stage production container"
	@echo "  docker-run    Run production container on port $(PORT)"
	@echo "  clean         Clean temporary artifacts and logs"

dev: ## Start local development server
	npm start

test: ## Execute test suite
	npm test

bench: ## Run latency and performance benchmark
	sh scripts/benchmark.sh

docker-build: ## Build multi-stage Docker container
	docker build -t $(APP_NAME):latest .

docker-run: ## Run Docker container
	docker run -d --name $(APP_NAME) -p $(PORT):8000 --restart unless-stopped $(APP_NAME):latest

clean: ## Clean scratch files and cache
	rm -rf .tmp scratch/*.log 2>/dev/null || true
