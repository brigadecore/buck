# BUCK: Brigade Universal Controller for Kubernetes

BUCK is the fastest way to build new controllers for Kubernetes. Define your CRD (or use an existing resource), and write a few lines of JavaScript for your controller code.

BUCK uses the event system of [Brigade](https://brigade.sh) to handle Kubernetes events. And it abstracts away the process of modeling and defining resource types. It's ultra-fast Rust server manages the controller (the _informer_ in Kubernetes terminology) and you just write the handling code. If you can install a Helm chart and write a few lines of JS, you can build a Kubernetes controller.

If you have Brigade installed and configured, BUCK is as easy as 1-2-3.

## Step 0. Clone this repository

You know what to do! `git clone git@github.com:technosophos/buck.git`

## Step 1: Write your JS Controller

This is a `brigade.js`-flavored script:

```javascript
const { events } = require("brigadier");

events.on("resource_added", handle);     // New resource is created
events.on("resource_modified", handle);  // Existing resource is modified
events.on("resource_deleted", handle);   // Existing resource is deleted
events.on("resource_error", handle);     // Something weird happened, and we think you should know about it

function handle(e, p) {
    let obj = JSON.parse(e.payload); // <-- your Kubernetes object
    console.log(obj);
}
```

## Step 2: Create a new Brigade project

Creating new Brigade projects is done with `brig project create`. You can tune your project however you want, but this is the most minimal way:

- Choose `no-VCS`
- Name it (e.g. `buck-test`)
- Answer `No` for `Add Secrets`
- Hit enter for `Auto-generate Generic Gateway secret`
- Leave `Default script ConfigMap name` blank
- Type `brigade.js` when prompted to `Upload a default brigade.js script` (This is the path to the `brigade.js` script you created in Step 1)
- Answer `N` for `Configure advanced options`

This will give you a brigade ID that looks something like `brigade-XXXXXXXXXXXXXX`. You will need this.

## Step 3. Use Helm to Define Your Resource

Your Helm `values.yaml` file is your entry point. Create the file and add your data:

```yaml
project: brigade-XXXXXXXXXXXXXX  # The ID created from Step 2
crd: # The CRD that you want to define.
    group: my.example.com
    version: v1
    kind: Book   # This should be capitalized
    plural: books
```

You can get the Brigade `project` ID by running `brig project list`.

Now you can install the Helm 3 chart with `helm install $NAME ./charts/buck -f values.yaml`, where `$NAME` is whatever name you want (usually something like `book-controller`).

# Technical Details

The BUCK Helm chart does the following things:

- Creates a CRD (if necessary)
- Creates a Brigade project
- Adds a one-shot controller for your resource type
- Configures the controller to execute for your project

All you need to do is install the chart.