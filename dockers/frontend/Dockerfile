FROM nginx

WORKDIR /usr/share/nginx/html

COPY ./frontend/ .

WORKDIR /etc/nginx/conf.d

COPY ./default.conf .

EXPOSE 80
