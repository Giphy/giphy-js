#!/bin/bash
set -e

for package in {.,packages/*}; do
  package_name=$(basename "$package")
  case $package_name in
  '.')
    sd_app_name='giphy-js-monorepo'
    ;;
  'util')
    sd_app_name='giphy-js-utils'
    ;;
  *)
    sd_app_name="giphy-js-${package_name}"
    ;;
  esac

  printf "\033[0;32mChecking dependencies in %s\033[0m\n" "$sd_app_name"
  docker run --rm \
    -v "${PWD}/${package}/package.json:/mnt/package.json:ro" \
    -v "${PWD}/yarn.lock:/mnt/yarn.lock:ro" \
    -e SERVICE_DICTIONARY_APP_NAME="$sd_app_name" \
    -e SERVICE_DICTIONARY_API_KEY \
    -e SERVICE_DICTIONARY_CHECK_APP_ENABLED \
    -e SERVICE_DICTIONARY_UPLOAD_LICENSES \
    -e SERVICE_DICTIONARY_URL \
    "${REGISTRY}/${LICENSE_CHECKER_IMAGE}" \
    -t npm18 -p web-sdk -f package.json
done
