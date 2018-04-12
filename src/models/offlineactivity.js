const {
  pool,
  queryFormat,
  P
} = require('./utils');

// 返回线下活动进行列表

let offlineProcessList = async function () {
  let time = new Date().getTime();
  let sql = queryFormat('select uuid, start_time,end_time,title,second_type,address,city,visit_count,join_count,picture_path,created_time from  tb_article  where first_type = ? and user_type = ? and end_time > ? order by created_time desc', ['OFFLINE', 'MANAGER', time]);
  let result = await P(pool, 'query', sql);
  return result;
};


// 返回线下活动历史列表

let offlineHistoryList = async function () {
  let time = new Date().getTime();
  let sql = queryFormat('select uuid, start_time,end_time,title,second_type,address,city,visit_count,join_count,picture_path,created_time from  tb_article  where first_type = ? and user_type = ? and end_time < ? order by created_time desc', ['OFFLINE', 'MANAGER', time]);
  let result = await P(pool, 'query', sql);
  return result;
};

//获取线下活动详情
let getOfflineDetail = async function (options) {
  let sql = queryFormat('select uuid, start_time,end_time,title,content,second_type,address,city,visit_count,join_count,picture_path,created_time from  tb_article where uuid = ?', [options.article_id]);
  let result = await P(pool, 'query', sql);
  // 修改浏览数量
  let visit_sql = queryFormat('update tb_article set visit_count = visit_count + 1 where uuid = ?', [options.article_id]);
  await P(pool, 'query', visit_sql);
  
  return result[0];
};

//  申请参与
let apply = async function (options) {
  let time = new Date().getTime();
  let sql = queryFormat('insert into tb_member_action set article_id = ?,member_id = ?,action = ?,created_time =?', [options.article_id, options.member_id, 'JOIN', time]);
  await P(pool, 'query', sql);
  let join_count_sql = queryFormat('update tb_article set join_count = join_count +1 where uuid = ?', [options.article_id]);
  await P(pool, 'query', join_count_sql);
};

// 经销商查询 地区接口
let getArea = async function (options) {
  let sql = queryFormat('select id as pronvince_id,name from tb_address where id < 100');
  let result = await P(pool, 'query', sql);
  return result;
};
// 查询保时捷中心
let getPorscheCenter = async function (options) {
  let sql = queryFormat('select uuid,cn_name from tb_porsche_center where province_id = ?', [options.province_id]);
  let result = await P(pool, 'query', sql);
  return result;
};
//查询保时捷中心地址
let getPorscheAddr = async function (options) {
  let sql = queryFormat('select detail_address from tb_porsche_center where uuid = ?', [options.porsche_center_id]);
  let result = await P(pool, 'query', sql);
  return result[0];
};

// 经销商查询添加

let dealer = async function (options) {
  let time = new Date().getTime();
  let sql = queryFormat('insert into tb_dealer set porsche_center_id = ?,member_id = ?,type = ?,created_time = ?', [options.porsche_center_id, options.member_id, 'CONTACT', time]);
  await P(pool, 'query', sql);
};

// 试驾申请
let driveApply = async function (options) {
  let time = new Date().getTime();
  let sql = queryFormat('insert into tb_dealer set porsche_center_id = ?,member_id = ?,trial_drive_time = ?,type = ?,created_time = ?', [options.porsche_center_id, options.member_id, options.trial_drive_time, 'DRIVE', time]);
  await P(pool, 'query', sql);
};



module.exports = {
  offlineProcessList: offlineProcessList,
  offlineHistoryList: offlineHistoryList,
  getOfflineDetail: getOfflineDetail,
  apply: apply,
  getArea: getArea,
  getPorscheCenter: getPorscheCenter,
  getPorscheAddr: getPorscheAddr,
  dealer: dealer,
  driveApply: driveApply
};
