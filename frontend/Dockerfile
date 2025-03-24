# Step 1: Use an official Node.js image to build the app
FROM node:20

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json (or yarn.lock) to the container
COPY package.json package-lock.json ./

# Step 4: Install the dependencies
RUN npm install

# Step 5: Copy the rest of the application code to the container
COPY . .

# Step 6: Expose the port the app will run on
EXPOSE 3000

# Run the React app
CMD ["npm", "start"]