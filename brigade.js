const { events, Job } = require("@brigadecore/brigadier");
const { Check } = require("@brigadecore/brigade-utils");

const projectName = "buck";
const rustImg = "rust:1.38";

function build(event, project) {
    var build = new Job(`${projectName}-build`, rustImg);
    build.tasks = [
        "cd /src",
        "cargo test",
    ];
    return build;
}

function runSuite(e, p) {
    var check = new Check(e, p, build(e, p));
    check.run();
}

events.on("check_suite:requested", runSuite);
events.on("check_suite:rerequested", runSuite);

// this enables "/brig run" comments from allowed authors to start a check run
events.on("issue_comment:created", (e, p) =>
    Check.handleIssueComment(e, p, runSuite)
);