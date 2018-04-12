const router = require('koa-router')();
const offline = require('../models/offlineactivity');
const RETCODE = require('../models/retcode');
const schema = require('../models/schema');

let offlineProcessList = async function (ctx) {
  try {
    let result = await offline.offlineProcessList();
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '返回线下活动进行列表成功'
    };
  } catch (e) {

    console.log(e);
    return ctx.body = {
      code: RETCODE.ERROR,
      message: '返回线下活动进行列表失败，请重试'
    };
  }
};

let offlineHistoryList = async function (ctx) {
  try {
    let result = await offline.offlineHistoryList();
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '返回线下活动历史列表成功'
    };
  } catch (e) {
    console.log(e);
    return ctx.body = {
      code: RETCODE.ERROR,
      message: '返回线下活动历史列表失败，请重试'
    };
  }
};

let offlineDetail = async function (ctx) {
  try {
    let article_id = ctx.request.body.article_id || '';
    let member_id = ctx.session.member.member_id || '';
    // let myURL = url.parse(ctx.request.header.referer);
    // let visit_url = myURL.path + myURL.hash;
    let options = {
      article_id: article_id,
      member_id: member_id
    };
    schema.validate(options, schema.offlineDetail);
    let result = await offline.getOfflineDetail(options);
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '返回线下活动详情成功'
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
      message: '返回线下活动详情失败，请重试'
    };
  }
};

let offlineApply = async function (ctx) {
  try {
    let article_id = ctx.request.body.article_id || '',
      member_id = ctx.session.member.member_id || '';
    let options = {
      article_id: article_id,
      member_id: member_id
    };
    schema.validate(options, schema.offlineApply);
    await offline.apply(options);
    return ctx.body = {
      code: RETCODE.OK,
      message: '线下活动申请成功'
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
      message: '线下活动申请失败，请重试'
    };
  }
};

let offlineArea = async function (ctx) {
  try {
    let result = await offline.getArea();
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '返回地区接口成功'
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
      message: '返回地区接口失败，请重试'
    };
  }
};

let offlineCenter = async function (ctx) {
  try {
    let province_id = ctx.request.body.province_id || '';
    let options = {
      province_id: province_id
    };
    schema.validate(options, schema.offlineCenter);
    let result = await offline.getPorscheCenter(options);
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '返回保时捷中心接口成功'
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
      message: '返回保时捷中心接口失败，请重试'
    };
  }
};

let offlinePorscheAddr = async function (ctx) {
  try {
    let porsche_center_id = ctx.request.body.porsche_center_id || '';
    let options = {
      porsche_center_id: porsche_center_id
    };
    schema.validate(options, schema.offlinePorscheAddr);
    let result = await offline.getPorscheAddr(options);
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '返回保时捷中心地址接口成功'
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
      message: '返回保时捷中心地址接口失败，请重试'
    };
  }
};



let offlineDealer = async function (ctx) {
  try {
    let porsche_center_id = ctx.request.body.porsche_center_id || '',
      member_id = ctx.session.member.member_id || '';
    let options = {
      porsche_center_id: porsche_center_id,
      member_id: member_id
    };
    schema.validate(options, schema.offlineDealer);
    await offline.dealer(options);
    return ctx.body = {
      code: RETCODE.OK,
      message: '返回经销商查询申请成功'
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
      message: '返回经销商查询申请失败，请重试'
    };
  }
};

let offlineDrive = async function (ctx) {
  try {
    let porsche_center_id = ctx.request.body.porsche_center_id || '',
      member_id = ctx.session.member.member_id || '',
      trial_drive_time = ctx.request.body.trial_drive_time || '';
    let options = {
      porsche_center_id: porsche_center_id,
      member_id: member_id,
      trial_drive_time: trial_drive_time
    };
    schema.validate(options, schema.offlineDrive);
    await offline.driveApply(options);
    return ctx.body = {
      code: RETCODE.OK,
      message: '返回试驾申请成功'
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
      message: '返回试驾申请失败，请重试'
    };
  }
};

router
  .post('/member/offline/process/list', offlineProcessList) // 线下活动进行列表
  .post('/member/offline/history/list', offlineHistoryList) // 线下活动历史列表
  .post('/member/offline/detail', offlineDetail) //  线下活动详情
  .post('/member/offline/apply', offlineApply) // 线下活动申请参与
  .post('/member/offline/area', offlineArea)// 返回地区接口
  .post('/member/offline/center', offlineCenter)//返回保时捷中心
  .post('/member/offline/porscheaddr', offlinePorscheAddr)//返回保时捷中心地址
  .post('/member/offline/dealer', offlineDealer) // 经销商查询申请
  .post('/member/offline/drive', offlineDrive); // 试驾申请


module.exports = router;
