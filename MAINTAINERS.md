# Maintaining the docker/welcome-to-docker Image

The image is stored on Docker Hub at the `itsslumpbro/docker-stuff` repo.

Use the `latest` tag

To push a change to the welcome-to-docker Hub image:
```
git checkout small-image
docker buildx create --name mybuilder --use --bootstrap # only if not created before
docker buildx build --push --platform linux/amd64,linux/arm64 --tag docker/welcome-to-docker .
```
