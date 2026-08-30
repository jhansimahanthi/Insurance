FROM node:22-alpine AS build
WORKDIR /app
COPY insurance-ui/package*.json ./
RUN npm ci
COPY insurance-ui/ .
RUN npx ng build --configuration production

FROM nginx:alpine
COPY --from=build /app/dist/insurance-ui/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
