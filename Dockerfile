FROM node:12-alpine
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
COPY package.json ./
RUN npm install
# Copy app source code
COPY . .
#Expose port and start application
EXPOSE 80
CMD [ "npm", "start" ]