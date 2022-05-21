develop:
	npx webpack serve
	
install:
	npm ci
	
build:
	rm -rf dist
	NODE_ENV=production npx webpack

buildProd:
	rm -rf dist
	NODE_ENV=development npx webpack

lint: 
	npx eslint .

test:
	npm test

.PHONY: test
