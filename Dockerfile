FROM node:12-alpine as builder

COPY . /usr/src/app

WORKDIR /usr/src/app

RUN apk update && \
  apk upgrade && \
  apk --no-cache add --virtual builds-deps build-base python && \
  rm -rf ./node_modules && \
  yarn --production && \
  apk del builds-deps
# End of build stage

FROM node:12-alpine

COPY --from=builder /usr/src/app /usr/src/app

WORKDIR /usr/src/app

CMD [ "yarn", "start" ]
