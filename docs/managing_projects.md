# Managing Buck Projects

Buck is a Brigade gateway. It provides a listener on the Kubernetes event stream, and then converts relevant activity to Brigade events.

As with other Brigade tools, Buck requires that you create a Brigade project for each handler.

## Installing Projects

The introduction to Buck suggests this way of creating a new project:

Run `brig project create` and then answer the prompts as follows.

- Choose `no-VCS`
- Name it (e.g. `buck-test`)
- Answer `No` for `Add Secrets`
- Hit enter for `Auto-generate Generic Gateway secret`
- Leave `Default script ConfigMap name` blank
- Type `brigade.js` when prompted to `Upload a default brigade.js script` (This is the path to the `brigade.js` script you created in Step 1)
- Answer `N` for `Configure advanced options`

This is a great way to quickly get your Buck project running. But updating a project requires you to use `kubectl` to update the Brigade javascript that is stored in the secret. Likewise, you can store the script in a `ConfigMap` and set `Default script ConfigMap name` to point to that ConfigMap. With this method, you merely need to edit the script in the ConfigMap and use `kubectl apply` to update it. This method is covered more below.

Finally, you may wish to use a Git repository to store your `brigade.js` file. This method is covered extensively in the Brigade documentation. 

### Using a ConfigMap to store the Brigade script

You can load your `brigade.js` file into a dedicated ConfigMap. Assuming you have a `brigade.js` file at the path `example/brigade.js`, use `kubectl` to create the ConfigMap and load it in your cluster:

```console
$ kubectl create configmap buck-script --from-file=brigade.js=examples/brigade.js
```

Then create a new project, selecting slightly different options. Run `brig project create` and then answer the prompts as follows.

- Choose `no-VCS`
- Name it (e.g. `buck-test`)
- Answer `No` for `Add Secrets`
- Hit enter for `Auto-generate Generic Gateway secret`
- Set `Default script ConfigMap name` to `buck-script` (the name you gave in the `kubectl` command above)
- When prompted to `Upload a default brigade.js script`, leave it blank
- Answer `N` for `Configure advanced options`

In this case, Buck will now read the `brigade.js` in the ConfigMap you created above. Editing the `brigade.js` script can be done two ways:

- You can edit the script inside of the ConfigMap using `kubectl edit configmap buck-script`
- Or you can edit the script locally and recreate or update the ConfigMap

For more on using a ConfigMap, see [the Brigade documentation](https://docs.brigade.sh/topics/projects/)

### Storing a Brigade script in Git

The most common way of storing Brigade scripts is to put them in a Git repository and point your project configuration to that repository. The Briagde [Quickstart](https://docs.brigade.sh/intro/quickstart/#using-brigade-with-a-version-control-system) explains this process.

You must create a Git repository and store your `brigade.js` file at the root of that repository. If you are using a `brigade.json` file to include additional dependencies, this is the only method that will support adding `brigade.json`.

Once you have your Git repository, you can set up your project to reference that repository. Run `brig project create` and provide answers like this:

```console
$ brig project create
? VCS or no-VCS project? *VCS*
? Project Name *myname/myrepo*
? Full repository name *github.com/myname/myrepo*
? Clone URL (https://github.com/your/repo.git) *https://github.com/myname/myrepo.git*
? Add secrets? No
? Where should the project's shared secret come from? Auto-generate one now
Auto-generated a Shared Secret: "XXXXXXXXXXXXXXXXX"
? Configure GitHub Access? No
? Configure advanced options No
Project ID: brigade-XXXXXXXXX
```

The above will create a project that pulls its `brigade.js` (and `brigade.json`) from the `myname/myrepo` repository at GitHub.