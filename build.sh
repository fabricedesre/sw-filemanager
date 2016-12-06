#!/bin/bash

set -x -e

svelte compile --format iife FileTable.html > FileTable.js