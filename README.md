# BUCK: Brigade Universal Controller for Kubernetes

BUCK is the fastest way to build new controllers for Kubernetes. Define your CRD (or use an existing resource), and write a few lines of JavaScript for your controller code.

BUCK uses the event system of Brigade to handle Kubernetes events. And it abstracts away the process of modeling and defining resource types. It's ultra-fast Rust server manages the controller (the _informer_ in Kubernetes terminology) and you just write the handling code. If you can install a Helm chart and write a few lines of JS, you can build a Kubernetes controller.

If you have Brigade installed and configured, BUCK is as easy as 1-2-3.

## Step 1. Use Helm to Define Your Resource

You Helm `vaules.yaml` file is your entry point:

```yaml
project: brigade-XXXXXXXXXXXXXX
crd:
    group: my.example.com
    version: v1alpha1
    kind: Book   # This should be capitalized
    pluralKind: books
```

## Step 2: Write your JS

This is a `brigade.js`-flavored script:

```javascript
const {events} = require("brigadier");

events.on("resource_added", (e, p) => {
    let obj = JSON.parse(e.payload); // <-- your Kubernetes object
    console.log(obj);
})

// Events available:
// - resource_added
// - resource_modified
// - resource_deleted
// - resource_error
```

## Step 3: Install it with Helm

```console
$ helm install buck charts/buck -f myvalues.yaml
```

# Technical Details

The BUCK Helm chart does the following things:

- Creates a CRD (if necessary)
- Creates a Brigade project
- Adds a one-shot controller for your resource type
- Configures the controller to execute for your project

All you need to do is install the chart.