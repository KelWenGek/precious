module.exports = {

    appActive:[
        {
            dirName: 'style',
            children: [{
                dirName: 'global',
                children: ['global.css']
            }]
        },
        {
            dirName: 'images',
            children: []
        },
        {
            dirName: 'components',
            children: ['app.vue']
        },
        'index.js',
        'index.html'
    ],
    pcActive:[
        {
            dirName: 'style',
            children: ['app.css']
        },
        {
            dirName: 'images',
            children: []
        },
        {
            dirName: 'components',
            children: ['app.vue']
        },
        'index.js',
        'index.html',
        'config.json'
    ]
};
//children属性中，如果为字符串则写入文件，此时必须带上文件后缀名
//如果要创建文件夹，则要以{dirName: 'dirName',children: []}对象形式放入children属性中