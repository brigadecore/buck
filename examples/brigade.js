const { events } = require("brigadier");

events.on("resource_added", handle);
events.on("resource_modified", handle);
events.on("resource_deleted", handle);
events.on("resource_error", handle);

function handle(e, p) {
    let obj = JSON.parse(e.payload); // <-- your Kubernetes object
    console.log(obj);
}