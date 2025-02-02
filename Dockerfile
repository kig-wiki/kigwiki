FROM node:18

WORKDIR /app

# Configure git safe directory so docusaurus and git can happyily get timestamps for sitemap.xml
RUN git config --global --add safe.directory /app


COPY package*.json ./

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start", "--", "--host", "0.0.0.0"] 