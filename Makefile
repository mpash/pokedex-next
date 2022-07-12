build:
		docker build . -t app
	
start: build
		docker run -dt -p 3000:3000 app