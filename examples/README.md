This is a basic example of BUCK.

This document walks through the process of setting up BUCK to run locally.

To use this example:

1. Create the `books` CRD: `kubectl create -f books-crd.yaml`
2. Run `brig project create` to create a new project
    - Choose no-VCS
    - Name it `bookdemo`
    - Answer `No` for `Add Secrets`
    - Auto-generate Generic Gateway secret
    - Leave `Default script ConfigMap name` blank
    - Type `examples/brigade.js` when prompted to `Upload a default brigade.js script`
    - Answer `N` for `Configure advanced options`
3. Execute `./run.sh` and leave it running. This will start Buck in the foreground
4. In another terminal, run `kubectl create -f examples/moby-dick.yaml`

Now you should be able to use `brig build list` to see your new build, or `kubectl` to troubleshoot.