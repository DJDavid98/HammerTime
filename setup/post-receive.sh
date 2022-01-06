#!/usr/bin/env bash
echo "##### post-receive hook #####"
read oldrev newrev refname
echo "Push triggered update to revision $newrev ($refname)"

RUN_FOR_REF="refs/heads/main"
if [[ "$refname" ==  "$RUN_FOR_REF" ]]; then
    GIT="env -i git"
    CMD_CD="cd $(readlink -nf "$PWD/..")"
    CMD_FETCH="$GIT fetch"
    CMD_YARN="npm"
    CMD_BUILD="nice npm run build"
    CMD_RESTART="pm2 reload pm2.json"

    echo "$ $CMD_CD"
    eval ${CMD_CD}
    echo "$ $CMD_FETCH"
    eval ${CMD_FETCH}

    if $GIT diff --name-only $oldrev $newrev | grep "^package-lock.json"; then
        echo "$ $CMD_YARN"
        eval $CMD_YARN
    else
        echo "# Skipping npm install, lockfile not modified"
    fi

    if $GIT diff --name-only $oldrev $newrev | grep "^\(src\|public\|package-lock.json\)/"; then
        echo "$ $CMD_BUILD"
        if eval $CMD_BUILD; then
          echo "Build successful"
        else
          echo "Build failed"
          exit 1
        fi
    else
        echo "# Skipping build, no changes in src or public folders"
    fi

    echo "$ $CMD_RESTART"
    eval $CMD_RESTART
else
    echo "Ref does not match $RUN_FOR_REF, exiting."
fi

echo "##### end post-receive hook #####"
