#!/usr/bin/env bash

APP_ENV=production yarn build \
  && cd dist \
  && zip -r "app.zip" .
