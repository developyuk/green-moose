FROM debian

RUN set -ex \
  && export DEBIAN_FRONTEND='noninteractive' \
  && apt-get update && apt-get install -y --no-install-recommends --no-install-suggests \
    ca-certificates \
    curl \

  && curl -sL https://deb.nodesource.com/setup_6.x | bash - \
  && apt-get install -y --no-install-recommends --no-install-suggests \
    nodejs \
  && rm -rf /var/lib/apt/lists/* \

  && apt-get clean -y && apt-get autoclean -y && apt-get autoremove -y \
  && rm -rf /var/cache/debconf/*-old /usr/share/doc/* /usr/share/man/* /usr/share/groff/* /usr/share/info/* /usr/share/locale/* /tmp/* /var/tmp/*

COPY package.json /project/package.json

WORKDIR /project
RUN set -ex \
  && npm install
