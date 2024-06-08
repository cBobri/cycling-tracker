# 1. Uporabi uradno Node.js sliko kot osnovo
FROM node:14

# 2. Nastavi delovni imenik
WORKDIR /usr/src/app

# 3. Kopiraj package.json in package-lock.json
COPY package*.json ./

# 4. Namesti odvisnosti
RUN npm install

# 5. Kopiraj preostale datoteke aplikacije
COPY . .

# 6. Expose porta, ki ga uporablja tvoja aplikacija (privzeto je to pogosto 3000)
EXPOSE 3000

# 7. Nastavi privzeti ukaz za zagon aplikacije
CMD [ "npm", "start" ]
