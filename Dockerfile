# Use the Node.js version

FROM node:22

# Set the directory

WORKDIR /app

COPY package*.json ./

# Dependencies

RUN npm install

COPY . .

# Set port

EXPOSE 3000

# Run the application

CMD ["npm", "start"]
