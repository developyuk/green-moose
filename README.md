# GREEN MOOSE
`Green Mooose` adalah sebuah layanan news/content aggregation (pengumpul berita / konten).

Another look a like service:
- line today / line feed
- feedly
- flipboard

## [Requirement](https://goo.gl/iY3Qrk)

## Setup project docker
1. Install docker from https://docs.docker.com/engine/installation/
2. Open docker terminal
3. Change directory to `/path/to/folder/green-moose`
4. Run `./docker-compose-build.sh`, wait until `Successfully built ..` message displayed
5. [Run project docker](#run-project-docker)

## Run project docker
1. Open Terminal
2. Change directory to `/path/to/folder/green-moose`
3. Run `./docker-compose-up.sh`, wait until complete
4. `CTRL+C` to exit logs

## Access project docker
Open this address on browser. Replace `docker.ip.address` with your docker machine IP Address

	http://docker.ip.address:9060/?url=http://tekno.kompas.com/read/2017/04/17/10400087/pengguna.snapchat.di.india.ramai-ramai.hapus.aplikasi.apa.sebabnya.

## Stop project docker
1. Open Terminal
2. Change directory to `/path/to/folder/green-moose`
3. Run `./docker-compose-down.sh`, wait until all installation complete
