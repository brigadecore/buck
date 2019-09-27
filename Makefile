REPO ?= technosophos/buck
TAG ?= latest

.PHONY: build
build:
	docker build -t $(REPO):$(TAG) .
	docker push $(REPO)