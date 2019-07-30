#!/bin/bash
# Execute this to push to my git repo, with 1 argument that will be the message of the commit. Still need to login after the push.
git add .
git commit -m "$1"
git push
