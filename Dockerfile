FROM node:lts-alpine
RUN curl -fsSL https://get.pnpm.io/install.sh | sh -
RUN npm i -g pnpm
WORKDIR	/src
ADD package.json  pnpm-lock.yaml ./
Run	pnpm install .
ADD	. /src
EXPOSE  3000
CMD     pnpm start:dev