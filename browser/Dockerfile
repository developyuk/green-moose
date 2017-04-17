FROM debian:jessie

RUN set -ex \
	&& apt-get update && apt-get install -y --no-install-recommends --no-install-suggests \
		ca-certificates \

	&& rm -rf /var/lib/apt/lists/* \

	&& apt-get clean -y && apt-get autoclean -y && apt-get autoremove -y \
	&& rm -rf /var/cache/debconf/*-old /usr/share/doc/* /usr/share/man/* /usr/share/groff/* /usr/share/info/* /usr/share/locale/* /tmp/* /var/tmp/*

RUN set -ex \
	&& apt-get update && apt-get install -y --no-install-recommends --no-install-suggests \
		libfontconfig \

	&& rm -rf /var/lib/apt/lists/* \

	&& apt-get clean -y && apt-get autoclean -y && apt-get autoremove -y \
	&& rm -rf /var/cache/debconf/*-old /usr/share/doc/* /usr/share/man/* /usr/share/groff/* /usr/share/info/* /usr/share/locale/* /tmp/* /var/tmp/*

WORKDIR /project
