#!/bin/bash
git add .
git commit -m "autoCommit"
git push
git push heroku main
heroku logs --tail