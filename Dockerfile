FROM  harbor.capitalonline.net/base/nginx-nodejs:v13
COPY  . /app
COPY ./dist /app/dist/mongodb
WORKDIR /app
