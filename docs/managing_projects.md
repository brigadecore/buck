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

Finally, you way wish to use a Git repository to store your `brigade.js` file. This method is covered extensively in the Brigade documentation. The [Quickstart](https://docs.brigade.sh/intro/quickstart/#using-brigade-with-a-version-control-system) is a good place to start. We don't devote any additional space to that method here.

## Using a ConfigMap to store the Brigade script

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