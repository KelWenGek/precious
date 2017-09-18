var path = require('path');
var _ = require('./util');
var dir = require('./directory');
var hierarchy = require('./hierarchy');

var stream = require('./readline');

var program = require('commander');
program
    .version('0.0.1')
    .usage('[options] <file ...>')
    .option('-i, --init [value]', '创建项目目录结构')
    .option('-t, --template <value>', '所需目录结构模板')
    .parse(process.argv);

//初始化创建项目目录
function createProject(projectName, templateName, mode) {

    templateName = templateName || 'appActive';

    //可配置的工作区
    var workFlowPath = path.resolve(__dirname, `./${templateName}`);

    //递归创建目录层级
    function createDirectoryHierarchy(directories) {
        //目录为单层目录
        if (!_.isArray(directories)) {
            return directories;
        }
        return directories.map((directory) => {
            if (_.type(directory) == 'Object') {
                return dir(directory.dirName, createDirectoryHierarchy(directory.children));
            } else {
                return directory;
            }
        });
    }

    var project = dir(projectName, createDirectoryHierarchy(hierarchy[templateName]));
    console.dir(project, {
        depth: null
    });
    //项目目录初始化开始
    project.mkdir(workFlowPath, mode);
}
// createProject(program.init, program.template);

stream(createProject);



