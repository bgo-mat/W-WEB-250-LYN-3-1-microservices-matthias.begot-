# Pull official base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install app dependencies
COPY package.json package-lock.json ./
RUN npm install

# Add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# Expose the port the app runs on
EXPOSE 3000

# Start the app in development mode
CMD ["npm", "start"]
