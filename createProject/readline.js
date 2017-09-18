var readline = require('readline');

//创建输入流

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (input) => {
    console.log(`你的输入：${input}`);
});

function getReadlineInput(text) {

    return new Promise((resolve, reject) => {
        rl.question(text, answer => {
            resolve(answer);
        });
    });
}

module.exports = function (callback) {
    let projectName, projectTpl;
    getReadlineInput('请输入项目主目录名称:')
        .then(name => {
            projectName = name;
            getReadlineInput('请输入项目结构模板名:')
                .then(tpl => {
                    projectTpl = tpl;
                    rl.close();
                    callback(projectName, projectTpl);
                });
        });
};