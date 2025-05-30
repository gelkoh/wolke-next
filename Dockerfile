FROM node:20-bookworm-slim AS base

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker cache (no npm install rerun if dependencies haven't changed)
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy the rest application code
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
