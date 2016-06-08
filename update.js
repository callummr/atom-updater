var fs = require("fs"),
    path = require("path"),
    exec = require('child_process').exec;

var p = path.join(getUserHome(), ".atom", "packages");
var results = {
  totalPackages: 0,
  runCount: 0,
  successCount: 0,
  errorCount: 0
};

fs.readdir(p, function (err, files) {
    if (err) {
        throw err;
    }

    files.map(function (folder) {
        return path.join(p, folder);
    }).filter(function (folder) {
        return fs.statSync(folder).isDirectory();
    }).forEach(function (folder) {
        results.totalPackages++;
        var name = path.basename(folder);
        //console.log(`Updating ${name}`);
        updatePackage(folder);
    });
});

function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

function updatePackage(packageFolder) {
  var pullCmd = "git pull";
  var installCmd = "npm install";
  var opts = {
    cwd: packageFolder
  };
  var packageName = path.basename(packageFolder);

  console.log(`Pulling latest for ${packageName}`)
  exec(pullCmd, opts, function(err) {
    if (err) {
      results.runCount++;
      results.errorCount++;
      checkDone();
      console.error(`Error updating ${packageName}`);
      console.error(err.message);
    } else {
      console.log(`Running npm install for ${packageName}`);
      exec(installCmd, opts, function(err) {
        results.runCount++;
        if (err) {
          results.errorCount++;
          console.error(`Error running npm install for ${packageName}`);
          console.error(err.message)
        } else {
          results.successCount++;
          console.log(`Done updating ${packageName} (${results.runCount}/${results.totalPackages})`);
        }

        checkDone();
      });
    }
  })
}

function checkDone() {
  if (results.runCount === results.totalPackages) {
    var errString = results.errorCount ? ", displayed above" : "";
    console.log(`Updating complete. There were ${results.errorCount} errors${errString}.`);
  }
}
