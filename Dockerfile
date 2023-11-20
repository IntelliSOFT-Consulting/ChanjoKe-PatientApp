# First Stage

FROM node:18-alphine
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm run install
COPY . .
RUN npm run build
CMD npm run start

# Second Stage
# FROM nginx:1.19.0
# WORKDIR /usr/share/nginx/html
# RUN rm -rf ./*
# COPY --from=builder /app/build .
# ENTRYPOINT [ "nginx", "-g", "daemon off;" ]