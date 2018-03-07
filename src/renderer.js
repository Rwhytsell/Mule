const fs = require('fs');
const {shell} = require('electron');
const os = require('os')
const path = require('path');

var home = os.homedir();
home = home.replace(/\\/g, '/') + '/';
console.log(home);

function readFolder(newFolder) {
    if(newFolder == 'init'){ newFolder = home;}
    console.log(newFolder);
    fs.readdir(newFolder, (err, files) => {
        if (err) throw err;
        else{
            document.getElementById('back').setAttribute("ondblclick", `readFolder("${path.dirname(newFolder).split(path.sep).pop() + '/'}")`)
            document.getElementById('path').innerHTML = newFolder;
            document.getElementById('listed-files').innerHTML = `<ol id="display-files"></ol>`;
            for (let file of files){
                if(file.charAt(0) != '.'){
                    fs.stat(newFolder+file, (err, stats) => {
                        if(err) throw err;
                        else{
                            let id = `${newFolder}${file}/`;
                            if(stats.isDirectory()){
                                document.getElementById('display-files').innerHTML += `<li id="${id}" ondblclick="readFolder(this.id)"><i class="fa fa-folder-open"></i> ${file}</li>`;
                            }
                            else {
                                document.getElementById('display-files').innerHTML += `<li id="${id}" ondblclick="openFile(this.id)"><i class="fa fa-file"></i> ${file}</li>`;
                            }
                        }
                    });
                }
            }
        }
    });
}

function openFile(file) {
    shell.openItem(file);
}