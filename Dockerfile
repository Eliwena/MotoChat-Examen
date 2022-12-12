FROM node:10-alpine

# Créer un répertoire pour l'application
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Installer les dépendances de l'application
COPY package.json /usr/src/app/
RUN npm install

# Copier les fichiers de l'application dans le répertoire de travail
COPY . /usr/src/app

# Exposer le port 3000 pour que l'application puisse être accessible depuis l'extérieur
EXPOSE 3000

# Lancer l'application avec la commande "npm start"
CMD ["npm", "start"]