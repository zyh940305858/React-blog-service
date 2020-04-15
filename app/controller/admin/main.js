'use strict';

const Controller = require('egg').Controller;

class MainController extends Controller {

  async index() {
    this.ctx.body = 'hi,api';
  }

  async checkLogin() {
    const { userName, password } = this.ctx.request.body;
    const sql = `SELECT userName FROM admin_user WHERE userName = ${userName} AND password=${password}`;
    const res = await this.ctx.mysql.query(sql);

    if (res.length > 0) {
      const openId = new Date().getTime();
      this.ctx.session.openId = { openId };
      this.ctx.body = { data: '登陆成功', openId };
    } else {
      this.ctx.body = { data: '登陆失败' };
    }
  }

}

module.exports = MainController;