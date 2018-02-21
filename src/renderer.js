const fs = require('fs');
const {shell} = require('electron');

function readFolder(path) {
    fs.readdir(path, (err, files) => {
        if (err) throw err;
        else{
            document.getElementById('back').setAttribute("ondblclick", `prevDirectory("${path}")`)
            document.getElementById('path').innerHTML = path;
            document.getElementById('listed-files').innerHTML = `<ol id="display-files"></ol>`;
            for (let file of files){
                if(file.charAt(0) != '.'){
                    fs.stat(path+file, (err, stats) => {
                        if(err) throw err;
                        else{
                            let id = `${path}${file}/`;
                            if(stats.isDirectory()){
                                document.getElementById('display-files').innerHTML += `<li id=${id} ondblclick="readFolder(this.id)"><i class="fa fa-folder-open"></i> ${file}</li>`;
                            }
                            else {
                                document.getElementById('display-files').innerHTML += `<li id=${id} ondblclick="openFile(this.id)"><i class="fa fa-file"></i> ${file}</li>`;
                            }
                        }
                    });
                }
            }
        }
    });
}

function openFile(path) {
    shell.openItem(path);
}

function prevDirectory(path) {
    console.log(path);
    if(path.length != 1){
        for(let i = (path.length-2); i >= 0; i--)
        {
            if(path[i]=='/'){
                let newPath = path.slice(0,i+1);
                console.log(newPath);
                readFolder(newPath);
                return;
            }
        }
    }
}