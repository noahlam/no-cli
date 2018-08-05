#!/usr/bin/env node
const shell = require('shelljs');
const program = require('commander');
const inquirer = require('inquirer');
const ora = require('ora');
const fs = require('fs');
const path = require('path');
const spinner = ora();
const gitClone = require('git-clone')
const chalk = require('chalk')


program
	.version('1.0.0', '-v, --version')
	.parse(process.argv);

const questions = [{
  type: 'input',
  name: 'name',
  message: '请输入项目名称',
  default: 'my-project',
  validate: (name)=>{
    if(/^[a-z]+/.test(name)){
      return true;
    }else{
      return '项目名称必须以小写字母开头';
    }
  }
}]

inquirer.prompt(questions).then((dir)=>{
  downloadTemplate(dir.name);
})

function downloadTemplate(dir){

  //  判断目录是否已存在
  let isHasDir = fs.existsSync(path.resolve(dir));
  if(isHasDir){
    spinner.fail('当前目录已存在!');
    return false;
  }
  spinner.start(`您选择的目录是: ${chalk.red(dir)}, 数据加载中,请稍后...`);

  // 克隆 模板文件
  // gitClone(`http://39.107.89.91:10010/noahlam/main-frame.git`, dir , null, function(err) {
  gitClone(`https://github.com/noahlam/main-frame.git`, dir , null, function(err) {
    // 移除无用的文件
    shell.rm('-rf', `${dir}/.git`)
	  spinner.succeed('项目初始化成功!')
    // 运行常用命令
    shell.cd(dir)
	  spinner.start(`正在帮您安装依赖...`);
    shell.exec('npm i')
	  spinner.succeed('依赖安装成功!')
    shell.exec('npm run dev')
  })
}