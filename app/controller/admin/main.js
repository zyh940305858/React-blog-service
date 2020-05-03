'use strict';

const Controller = require('egg').Controller;

class MainController extends Controller {

  async index() {
    this.ctx.body = 'hi,api';
  }

  // 登录接口
  async checkLogin() {
    const { userName, password } = this.ctx.request.body;
    const sql = `SELECT userName FROM admin_user WHERE userName = "${userName}" AND password="${password}"`;
    const res = await this.app.mysql.query(sql);
    if (res.length > 0) {
      const openId = new Date().getTime();
      this.ctx.session.openId = { openId };
      this.ctx.body = { data: '登陆成功', openId };
    } else {
      this.ctx.body = { data: '登陆失败' };
    }
  }

  // 获取文章类型接口
  async getTypeInfo() {
    const resType = await this.app.mysql.select('type');
    this.ctx.body = { data: resType };
  }

  // 添加文章接口
  async addArticle() {
    const tmpArticle = this.ctx.request.body;
    const result = await this.app.mysql.insert('article', tmpArticle);
    const insertSuccess = result.affectedRows === 1;
    const insertId = result.insertId;

    this.ctx.body = {
      isSuccess: insertSuccess,
      insertId,
    };
  }

  // 更新文章接口
  async updateArticle() {
    const tempArticle = this.ctx.request.body;
    const result = await this.app.mysql.update('article', tempArticle);
    const updateSuccess = result.affectedRows === 1;

    this.ctx.body = { isSuccess: updateSuccess };
  }

  // 获取文章列表接口
  async getArticleList() {
    const sql = 'SELECT article.id as id ,' +
      'article.title as title ,' +
      'article.introduce as introduce ,' +
      // "FROM_UNIXTIME(article.addTime,'%Y-%m-%d %H:%i:%s') as addTime"+
      'article.addTime as addTime ,' +
      'article.view_count as view_count ,' +
      'type.typeName as typeName ' +
      'FROM article LEFT JOIN type ON article.type_id = type.Id ' +
      'ORDER BY article.id DESC';
    const resList = await this.app.mysql.query(sql);
    this.ctx.body = { list: resList };
  }

}

module.exports = MainController;
