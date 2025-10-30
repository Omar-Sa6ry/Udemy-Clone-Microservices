FROM node:20.17.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

CMD ["npm", "run", "start:dev"]


# # Production image
# FROM node:20.17.0
# WORKDIR /app
# COPY --from=builder /app ./
# CMD ["npm", "run", "start:dev"]

# # docker build -t user-service -f services/user-service/Dockerfile .