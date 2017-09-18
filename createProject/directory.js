var fs = require('fs');
var path = require('path');
var _ = require('./util');

//文件目录构造器
function Directory(dirName, children) {
    if (!(this instanceof Directory)) {
        return new Directory(dirname, children);
    }
    if (!_.isArray(children) && children != null) {
        children = _.slice(arguments, 1);
    }
    this.dirName = dirName;
    this.children = children || [];
}

Directory.prototype.mkdir = function (parentDir, mode) {
    var currentDir = '';
    var projectDir = path.resolve(parentDir, this.dirName);
    if (!fs.existsSync(projectDir)) {
        projectDir.split(path.sep)
                  .forEach((dirName) => {
                      if (currentDir) {
                          currentDir = path.join(currentDir, dirName);
                      }
                      else {
                          currentDir = dirName;
                      }
                      if (!fs.existsSync(currentDir)) {
                          if (!fs.mkdirSync(currentDir, mode)) {

                              //是否递归到实例的dirName层级目录上
                              if (dirName != this.dirName) {
                                  return false;
                              }

                              this.children.forEach((child) => {
                                  if (child) {
                                      if (child instanceof Directory) {
                                          //判断是子级目录
                                          child.mkdir(currentDir, mode);
                                      } else {
                                          var childFile = path.join(currentDir, child);
                                          var tempFile = path.resolve(__dirname, `./template/${child}`);
                                          var childFileContent = fs.existsSync(tempFile) ? fs.readFileSync(tempFile) : '';
                                          fs.writeFileSync(childFile, childFileContent);
                                      }
                                  }
                              });
                          }
                      }
                  });
    }
};

module.exports = function (dirName, children) {
    return new Directory(dirName, children);
};