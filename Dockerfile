FROM node:12-alpine
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
COPY package.json ./
RUN npm install
#Build FE
RUN npm run build
# Copy app source code
COPY . .
#Expose port and start application
EXPOSE 80
CMD [ "npm", "startServer" ]