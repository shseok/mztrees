FROM node:16-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . .
# RUN rm -rf .env or use .dodkerignore
RUN yarn
EXPOSE 8080
CMD [ "yarn", "start" ]