FROM node:slim

ENV H5R_OUTPUT_DIR="/usr/app/output"
WORKDIR /usr/app
COPY . .

# https://github.com/uncss/uncss/issues/165#issuecomment-135214246
RUN apt-get update && apt-get install -y curl libfontconfig

RUN npm i
RUN npm i -g .
RUN mkdir -p $H5R_OUTPUT_DIR

ENTRYPOINT ["h5recorder"]
