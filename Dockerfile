# compile app
FROM node:20.12-bookworm-slim as compile
WORKDIR /app
#When using COPY with more than one source file, the destination must be a directory and end with a /
COPY ./package*.json ./
RUN npm ci
COPY . ./

# this is equivalent to 'ionic build --prod'
RUN npm run build --configuration app 

# deploy with nginx
FROM nginx:1.25.5-alpine-slim
COPY --from=compile /app/dist/browser /usr/share/nginx/html
EXPOSE 8080
