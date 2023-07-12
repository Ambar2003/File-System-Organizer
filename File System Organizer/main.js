#!/usr/bin/env node
let inputArray = process.argv.slice(2);
let fs = require("fs");
let path = require("path");
let types = {
    media:["mp4","mkv"],
    archives:['zip','7z','rar','tar','gz','ar','iso','xz'],
    documents:['docx','doc','pdf','xlsx','xls','odt','ods','odp','txt','ps'],
    app:['exe','dmg','pkg','deb','ppt']
}
let command = inputArray[0];
switch(command){
    case "tree":
        treeFn(inputArray[1]);
        break;
    case "organize":
        orgFn(inputArray[1]);
        break;
    case "help":
        helpFn(inputArray[1]);
        break;
    default:
        console.log("Please give correct Input!");
        break;
}
function treeFn(dirPath){
    if(dirPath == undefined){
        treeHelper(process.cwd(), "");;
        return;
    }else{
        let doesExist = fs.existsSync(dirPath);
        if(doesExist == false){
            console.log("Please put correct destination path");
            return;
        }else{
            treeHelper(dirPath, "");

    }
}
}
function treeHelper(dirPath,indent){
    //is file or folder
    let isFile = fs.lstatSync(dirPath).isFile();
    if(isFile == true){
        let fileName = path.basename(dirPath);
        console.log(indent + "|----" + fileName);
    }else{
        let dirName = path.basename(dirPath);
        console.log(indent + "-----" + dirName);
        let childrens = fs.readdirSync(dirPath);
        for(let i = 0;i<childrens.length;i++){
            let childPath = path.join(dirPath,childrens[i]);
            treeHelper(childPath, indent + "\t");
        }
    }
}
function orgFn(dirPath){
    //1. input->directory path given
    let destPath;
    if(dirPath == undefined){
        destPath = process.cwd();
        return;
    }else{
        let doesExist = fs.existsSync(dirPath);
        if(doesExist == false){
            console.log("Please put correct destination path");
            return;
        }else{
            //2. create->organized_files->directory
             destPath = path.join(dirPath,"organized_files");
            if(fs.existsSync(destPath) == false){
                    if(fs.mkdirSync(destPath) == false){
                        fs.mkdirSync(destPath);
                    }
        }
    }
}
    organizeHelper(dirPath,destPath);
}
function organizeHelper(src,dest){
    //3. identify categories of all the files present in that input directory->
        let childNames = fs.readdirSync(src);
        for(let i = 0;i<childNames.length;i++){
            let childAddress = path.join(src,childNames[i]);
            let isFile = fs.lstatSync(childAddress).isFile();
            if(isFile){
                // console.log(childNames[i]);
                let category = getCategory(childNames[i]);
                console.log(childNames[i],"belong to -->",category);
                //4. copy/cut files to that organized directory inside of any of cateogry folder
                sendFiles(childAddress,dest,category);
            }
        }
}
function organizeFn(dirPath) {
    // console.log("organize command implemnted for ", dirPath);
    // 1. input -> directory path given
    let destPath;
    if (dirPath == undefined) {
        destPath = process.cwd();
        return;
    } else {
        let doesExist = fs.existsSync(dirPath);
        if (doesExist) {

            // 2. create -> organized_files -> directory
            destPath = path.join(dirPath, "organized_files");
            if (fs.existsSync(destPath) == false) {
                fs.mkdirSync(destPath);
            }

        } else {

            console.log("Kindly enter the correct path");
            return;
        }
    }
    organizeHelper(dirPath, destPath);
}
function organizeHelper(src, dest) {
    // 3. identify categories of all the files present in that input directory  ->
    let childNames = fs.readdirSync(src);
    // console.log(childNames);
    for (let i = 0; i < childNames.length; i++) {
        let childAddress = path.join(src, childNames[i]);
        let isFile = fs.lstatSync(childAddress).isFile();
        if (isFile) {
            // console.log(childNames[i]);
            let category = getCategory(childNames[i]);
            console.log(childNames[i], "belongs to --> ", category);
            // 4. copy / cut  files to that organized directory inside of any of category folder 
            sendFiles(childAddress, dest, category);
        }
    }
}
function sendFiles(srcFilePath,dest,category){
    let categoryPath = path.join(dest,category);
    if(fs.existsSync(categoryPath) == false){
        fs.mkdirSync(categoryPath);
    }
    let fileName = path.basename(srcFilePath);
    let destFilePath = path.join(categoryPath,fileName);
    fs.copyFileSync(srcFilePath,destFilePath);
    fs.unlinkSync(srcFilePath);
    
}
function getCategory(name) {
    let ext = path.extname(name);
    ext = ext.slice(1);
    for (let type in types) {
        let cTypeArray = types[type];
        for (let i = 0; i < cTypeArray.length; i++) {
            if (ext == cTypeArray[i]) {
                return type;
            }
        }
    }
    return "others";
}
function helpFn(dirPath){
    console.log(
`List of all commands:
 1.node main.js tree "directoryPath"
 2.node main.js organize "directoryPath"
 3.node main.js help               `)
}


