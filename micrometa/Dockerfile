FROM debian:jessie

RUN set -ex \
	&& apt-get update && apt-get install -y --no-install-recommends --no-install-suggests \
		ca-certificates \

	&& rm -rf /var/lib/apt/lists/* \

	&& apt-get clean -y && apt-get autoclean -y && apt-get autoremove -y \
	&& rm -rf /var/cache/debconf/*-old /usr/share/doc/* /usr/share/man/* /usr/share/groff/* /usr/share/info/* /usr/share/locale/* /tmp/* /var/tmp/*

RUN set -ex \
	&& apt-get update && apt-get install -y --no-install-recommends --no-install-suggests \
		php5 \

	&& rm -rf /var/lib/apt/lists/* \

	&& apt-get clean -y && apt-get autoclean -y && apt-get autoremove -y \
	&& rm -rf /var/cache/debconf/*-old /usr/share/doc/* /usr/share/man/* /usr/share/groff/* /usr/share/info/* /usr/share/locale/* /tmp/* /var/tmp/*

RUN set -ex \
	&& php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
	&& php -r "if (hash_file('SHA384', 'composer-setup.php') === '669656bab3166a7aff8a7506b8cb2d1c292f042046c5a994c43155c0be6190fa0355160742ab2e1c88d40d5be660b410') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;" \
	&& php composer-setup.php \
	&& php -r "unlink('composer-setup.php');" \

	&& mv composer.phar /usr/local/bin/composer \

	&& cp /etc/apache2/sites-available/000-default.conf /etc/apache2/sites-available/010-micrometa.conf \
	&& sed -i 's/DocumentRoot .*/DocumentRoot \/var\/www\/micrometa/' /etc/apache2/sites-available/010-micrometa.conf \
	&& echo 'ServerName localhost' >> /etc/apache2/apache2.conf \

	&& echo '<Directory /var/www/micrometa>' >> /etc/apache2/apache2.conf \
	&& echo '  Options Indexes FollowSymLinks' >> /etc/apache2/apache2.conf \
	&& echo '  AllowOverride All' >> /etc/apache2/apache2.conf \
	&& echo '  Require all granted' >> /etc/apache2/apache2.conf \
	&& echo '</Directory>' >> /etc/apache2/apache2.conf \

	&& a2dissite 000-default \
	&& a2ensite 010-micrometa \

	&& a2enmod rewrite

WORKDIR /var/www/micrometa
