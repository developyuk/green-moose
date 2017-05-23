# GREEN MOOSE
`Green Mooose` adalah sebuah layanan news/content aggregation (pengumpul berita / konten).

Another look a like service:
- line today / line feed
- feedly
- flipboard

## TODO
- parse related url from content
- try using queued job / separate process to parse related url

## [Requirement](https://goo.gl/iY3Qrk)

## Setup project docker
1. Install docker from https://docs.docker.com/engine/installation/
2. Open docker terminal
3. Change directory to `/path/to/folder/green-moose`
4. Run `./docker-build.sh`, wait until `Successfully built ..` message displayed
5. [Run project docker](#run-project-docker)

## Run project docker

1. Get API key from mercury web parser

	1. Sign up at [mercury web parser](https://mercury.postlight.com/web-parser/)
	2. Get `MERCURY WEB PARSER API KEY`
	3. Replace `API_KEY` at [`parser/index.php` on line 9](../develop/parser/index.php#L9) with your own `MERCURY WEB PARSER API KEY`

2. Open Terminal
3. Change directory to `/path/to/folder/green-moose`
4. Run `./docker-up.sh`, wait until complete
5. `CTRL+C` to exit logs


## Using backend service
Open this address on browser. Replace `<docker.ip.address>` with your docker machine IP Address

**Add content url to db**

	$ curl -X POST -H "content-type:application/json" http://<docker.ip.address>:9065 -d '{"url":"https://www.techinasia.com/tia-sg-2017-arena-swingvy"}'

**Get all content**

	$ curl -H "content-type:application/json" http://<docker.ip.address>:9065

**Get content detail**

	$ curl -H "content-type:application/json" http://<docker.ip.address>:9065/1

## Stop project docker
1. Open Terminal
2. Change directory to `/path/to/folder/green-moose`
3. Run `./docker-down.sh`, wait until all installation complete
