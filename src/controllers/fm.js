const router = require('koa-router')();
const uuidv4 = require('uuid/v4');
const fm = require('../models/fm');
const RETCODE = require('../models/retcode');
const schema = require('../models/schema');
const KnownErrors = require('../models/error');
const utils = require('../models/utils');

let fmList = async function (ctx) {
  try {
    let startDate = ctx.request.body.startDate || '';
    let endDate = ctx.request.body.endDate || '';
    let options = {
      startDate: startDate,
      endDate: endDate
    };
    let result = await fm.getFMList(options);
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '获取挚享FM列表成功'
    };
  } catch (e) {
    console.log(e);
    return ctx.body = {
      code: RETCODE.ERROR,
      message: '返回挚享FM详情失败，请重试'
    };
  }
};

let fmMonth = async function (ctx) {
  try {
    let date = new Date();
    let nowMonth = date.getFullYear() + '-' + (date.getMonth() + 1);
    let monthArray = utils.getDateArray('2016-6', nowMonth);
    console.log(monthArray);
    return ctx.body = {
      code: RETCODE.OK,
      data: monthArray,
      message: '返回月份成功'
    };
  } catch (e) {
    console.log(e);
    return ctx.body = {
      code: RETCODE.ERROR,
      message: '返回月份失败，请重试'
    };
  }
};


let fmDetail = async function (ctx) {
  try {
    let article_id = ctx.request.body.article_id || ''; //文章uuid
    let member_id = ctx.session.member.member_id || '';
    let options = {
      article_id: article_id,
      member_id: member_id
    };
    schema.validate(options, schema.fmDetail);
    let result = await fm.getFMDetail(options);
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '返回挚享FM详情成功'
    };
  } catch (e) {
    console.log(e);
    if (e.name === 'ValidationError') {
      return ctx.body = {
        code: RETCODE.PARAM_ERROR,
        message: '参数错误'
      };
    }
    return ctx.body = {
      code: RETCODE.ERROR,
      message: '返回挚享FM详情失败，请重试'
    };
  }
};

let fmArticleUpvote = async function (ctx) {
  try {
    console.log(1111, ctx.request.body);
    let article_id = ctx.request.body.article_id || '';
    let member_id = ctx.session.member.member_id || '';
    let visit_url = ctx.request.body.visit_url || '';
    let options = {
      article_id: article_id,
      member_id: member_id,
      visit_url: visit_url
    };
    schema.validate(options, schema.fmArticleUpvote);
    let result = await fm.fmArticleUpvote(options);
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '感兴趣添加/取消成功'
    };
  } catch (e) {
    console.log(e);
    if (e.name === 'ValidationError') {
      return ctx.body = {
        code: RETCODE.PARAM_ERROR,
        message: '参数错误'
      };
    }
    return ctx.body = {
      code: RETCODE.ERROR,
      message: '感兴趣添加/取消失败，请重试'
    };
  }
};

let fmCommentList = async function (ctx) {
  try {
    let offset = ctx.request.body.offset || 0;
    let count = ctx.request.body.count || 10;
    let article_id = ctx.request.body.article_id || '';//文章uuid
    let member_id = ctx.session.member.member_id || '';
    let options = {
      article_id: article_id,
      member_id: member_id,
      offset: offset,
      count: count
    };
    schema.validate(options, schema.fmCommentList);
    let result = await fm.fmCommentList(options);
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '返回挚享FM评论列表成功'
    };
  } catch (e) {
    console.log(e);
    if (e.name === 'ValidationError') {
      return ctx.body = {
        code: RETCODE.PARAM_ERROR,
        message: '参数错误'
      };
    }
    return ctx.body = {
      code: RETCODE.ERROR,
      message: '返回挚享FM评论列表失败，请重试'
    };
  }
};

// 评论添加
let fmCommentAdd = async function (ctx) {
  try {
    let uuid = uuidv4();
    let article_id = ctx.request.body.article_id || '';
    let member_id = ctx.session.member.member_id || '';
    let content = ctx.request.body.content || '';
    let picture_path = ctx.request.body.picture_path || '';
    let type = ctx.request.body.type || '';
    let options = {
      uuid: uuid,
      article_id: article_id,
      member_id: member_id,
      content: content,
      picture_path: picture_path,
      type: type
    };
    schema.validate(options, schema.fmCommentAdd);
    await fm.fmCommentAdd(options);
    return ctx.body = {
      code: RETCODE.OK,
      message: '评论添加成功'
    };
  } catch (e) {
    console.log(e);
    if (e.name === 'ValidationError') {
      return ctx.body = {
        code: RETCODE.PARAM_ERROR,
        message: '参数错误'
      };
    }
    return ctx.body = {
      code: RETCODE.ERROR,
      message: '评论添加失败，请重试'
    };
  }
};


let fmCommentUpvote = async function (ctx) {
  try {
    let member_id = ctx.session.member.member_id || '';
    let comment_id = ctx.request.body.comment_id || '';
    let options = {
      member_id: member_id,
      comment_id: comment_id
    };
    schema.validate(options, schema.fmCommentUpvote);
    await fm.fmCommentUpvote(options);
    return ctx.body = {
      code: RETCODE.OK,
      message: '评论点赞成功'
    };
  } catch (e) {
    console.log(e);
    if (e.name === 'ValidationError') {
      return ctx.body = {
        code: RETCODE.PARAM_ERROR,
        message: '参数错误'
      };
    }
    return ctx.body = {
      code: RETCODE.ERROR,
      message: '返回挚享者说详情失败，请重试'
    };
  }
};

let fmCommentReply = async function (ctx) {
  try {
    let uuid = uuidv4();
    let article_id = ctx.request.body.article_id || '';
    let member_id = ctx.session.member.member_id || '';
    let to_comment_id = ctx.request.body.to_comment_id || '';
    let content = ctx.request.body.content || '';
    let picture_path = ctx.request.body.picture_path || '';
    let type = ctx.request.body.type || '';
    let options = {
      uuid: uuid,
      article_id: article_id,
      member_id: member_id,
      to_comment_id: to_comment_id,
      content: content,
      picture_path: picture_path,
      type: type
    };
    schema.validate(options, schema.fmCommentReply);
    await fm.fmCommentReply(options);
    return ctx.body = {
      code: RETCODE.OK,
      message: '评论回复成功'
    };
  } catch (e) {
    console.log(e);
    if (e.name === 'ValidationError') {
      return ctx.body = {
        code: RETCODE.PARAM_ERROR,
        message: '参数错误'
      };
    }
    return ctx.body = {
      code: RETCODE.ERROR,
      message: '回复评论失败，请重试'
    };
  }
};


let fmApply = async function (ctx) {
  try {
    let article_id = ctx.request.body.article_id || '',
      member_id = ctx.session.member.member_id || '';
    let options = {
      article_id: article_id,
      member_id: member_id
    };
    schema.validate(options, schema.fmApply);
    let result = await fm.apply(options);
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '申请参与成功'
    };
  } catch (e) {
    console.log(e);
    if (e.name === 'ValidationError') {
      return ctx.body = {
        code: RETCODE.PARAM_ERROR,
        message: '参数错误'
      };
    } else if (e instanceof KnownErrors.ErrorAlreadyExist) {
      return ctx.body = {
        code: RETCODE.ALREADY_EXIST,
        message: '已经申请过了，请不要重复申请'
      };
    }
    return ctx.body = {
      code: RETCODE.ERROR,
      message: '申请参与失败，请重试'
    };
  }
};



router
  .post('/member/fm/list', fmList) // fm列表
  .post('/member/fm/month', fmMonth) // 返回一段时间里的所有月份
  .post('/member/fm/detail', fmDetail) //  fm详情
  .post('/member/fm/article/upvote', fmArticleUpvote) //对活动很感兴趣
  .post('/member/fm/comment/list', fmCommentList) //fm评论列表
  .post('/member/fm/comment/add', fmCommentAdd) // fm评论添加
  .post('/member/fm/comment/upvote', fmCommentUpvote) // 光影放映厅对评论进行点赞
  .post('/member/fm/comment/reply', fmCommentReply) // 回复评论
  .post('/member/fm/apply', fmApply); // 申请参与


module.exports = router;
