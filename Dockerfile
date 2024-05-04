FROM nginx
COPY /dist/browser /usr/share/nginx/html
EXPOSE 8080
